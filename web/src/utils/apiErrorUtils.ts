import { captureException } from '@sentry/react';
import { ErrorCategory } from '../sentry';

/**
 * Types of API errors that can occur
 */
export enum ApiErrorType {
	NETWORK = 'network', // Connection issues
	SERVER = 'server', // 5xx errors
	CLIENT = 'client', // 4xx errors
	VALIDATION = 'validation', // 400 with validation errors
	AUTH = 'auth', // 401/403 errors
	TIMEOUT = 'timeout', // Request timeout
	PARSE = 'parse', // JSON parse errors
	UNKNOWN = 'unknown' // Other errors
}

/**
 * Enhanced API error class with better context
 */
export class ApiError extends Error {
	public readonly type: ApiErrorType;
	public readonly endpoint: string;
	public readonly status?: number;
	public readonly method: string;
	public readonly responseData?: any;
	public readonly requestData?: any;
	public readonly timestamp: Date;
	public readonly retryable: boolean;

	constructor({
		message,
		type = ApiErrorType.UNKNOWN,
		endpoint,
		status,
		method = 'GET',
		responseData,
		requestData,
		retryable = false
	}: {
		message: string;
		type?: ApiErrorType;
		endpoint: string;
		status?: number;
		method?: string;
		responseData?: any;
		requestData?: any;
		retryable?: boolean;
	}) {
		super(message);
		this.name = 'ApiError';
		this.type = type;
		this.endpoint = endpoint;
		this.status = status;
		this.method = method;
		this.responseData = responseData;
		this.requestData = requestData;
		this.timestamp = new Date();
		this.retryable = retryable;
	}

	/**
	 * Get a user-friendly message for this error
	 */
	public getFriendlyMessage(): string {
		// Default messages based on type and status
		switch (this.type) {
			case ApiErrorType.NETWORK:
				return 'Unable to connect to the server. Please check your internet connection.';

			case ApiErrorType.TIMEOUT:
				return 'The request timed out. Please try again.';

			case ApiErrorType.AUTH:
				return this.status === 401
					? 'Your session has expired. Please log in again.'
					: "You don't have permission to perform this action.";

			case ApiErrorType.VALIDATION:
				return 'Some of the information you provided is invalid.';

			case ApiErrorType.SERVER:
				return 'The server encountered an error. Our team has been notified.';

			case ApiErrorType.PARSE:
				return 'There was a problem processing the response from the server.';

			default:
				return this.message || 'An unexpected error occurred.';
		}
	}

	/**
	 * Determine if error should be tracked in Sentry based on type
	 */
	public shouldTrack(): boolean {
		// Don't track validation errors or auth errors by default
		return ![ApiErrorType.VALIDATION, ApiErrorType.AUTH].includes(this.type);
	}

	/**
	 * Track this error in Sentry with appropriate context
	 */
	public trackError(additionalContext?: Record<string, any>): string | undefined {
		if (!this.shouldTrack()) return;

		return captureException(this, {
			tags: {
				errorCategory: ErrorCategory.API,
				apiErrorType: this.type,
				apiMethod: this.method,
				apiStatus: this.status?.toString() || 'unknown'
			},
			extra: {
				api: {
					endpoint: this.endpoint,
					method: this.method,
					status: this.status,
					responseData: this.responseData,
					requestData: this.sanitizeRequestData(this.requestData),
					timestamp: this.timestamp.toISOString()
				},
				...additionalContext
			}
		});
	}

	/**
	 * Sanitize sensitive data from request payload
	 */
	private sanitizeRequestData(data: any): any {
		if (!data) return data;

		try {
			const sanitized = { ...data };

			// Remove potentially sensitive fields
			const sensitiveFields = [
				'password',
				'token',
				'secret',
				'apiKey',
				'api_key',
				'authorization',
				'auth',
				'credentials',
				'credit_card',
				'creditCard',
				'ssn',
				'social_security'
			];

			// Recursively sanitize object
			const sanitizeObj = (obj: any) => {
				if (!obj || typeof obj !== 'object') return obj;

				Object.keys(obj).forEach((key) => {
					// Check if this key contains sensitive data
					if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
						obj[key] = '[REDACTED]';
					}
					// Recursively sanitize nested objects
					else if (typeof obj[key] === 'object' && obj[key] !== null) {
						sanitizeObj(obj[key]);
					}
				});

				return obj;
			};

			return sanitizeObj(sanitized);
		} catch (e) {
			// If sanitization fails, return a safe fallback
			return { _sanitizationFailed: true };
		}
	}
}

/**
 * Helper function to create an ApiError from various error sources
 */
export function createApiError(
	error: any,
	endpoint: string,
	method = 'GET',
	requestData?: any
): ApiError {
	// Handle Axios errors
	if (error.isAxiosError) {
		const response = error.response;
		const request = error.request;

		// Network errors (no response)
		if (!response) {
			return new ApiError({
				message: error.message || 'Network error',
				type: error.code === 'ECONNABORTED' ? ApiErrorType.TIMEOUT : ApiErrorType.NETWORK,
				endpoint,
				method,
				requestData,
				retryable: true
			});
		}

		// Server responded with error status
		const status = response.status;
		const responseData = response.data;

		// Determine error type based on status code
		let type: ApiErrorType;
		let retryable = false;

		if (status >= 500) {
			type = ApiErrorType.SERVER;
			retryable = true; // Server errors might be temporary
		} else if (status === 401 || status === 403) {
			type = ApiErrorType.AUTH;
		} else if (status === 400) {
			type = ApiErrorType.VALIDATION;
		} else if (status === 404) {
			type = ApiErrorType.CLIENT;
		} else if (status >= 400) {
			type = ApiErrorType.CLIENT;
		} else {
			type = ApiErrorType.UNKNOWN;
		}

		// Extract message from response if available
		let message = error.message || `API Error (${status})`;
		if (responseData && typeof responseData === 'object') {
			if (responseData.message) {
				message = responseData.message;
			} else if (responseData.error) {
				message =
					typeof responseData.error === 'string'
						? responseData.error
						: JSON.stringify(responseData.error);
			}
		}

		return new ApiError({
			message,
			type,
			endpoint,
			status,
			method,
			responseData,
			requestData,
			retryable
		});
	}

	// Handle fetch errors
	if (error instanceof TypeError && error.message === 'Failed to fetch') {
		return new ApiError({
			message: 'Network error: Failed to fetch',
			type: ApiErrorType.NETWORK,
			endpoint,
			method,
			requestData,
			retryable: true
		});
	}

	// Handle JSON parse errors
	if (error instanceof SyntaxError && error.message.includes('JSON')) {
		return new ApiError({
			message: 'Invalid response format',
			type: ApiErrorType.PARSE,
			endpoint,
			method,
			requestData,
			retryable: false
		});
	}

	// Handle existing ApiErrors (pass through)
	if (error instanceof ApiError) {
		return error;
	}

	// Default case: unknown error
	return new ApiError({
		message: error.message || 'Unknown API error',
		type: ApiErrorType.UNKNOWN,
		endpoint,
		method,
		requestData,
		retryable: false
	});
}

/**
 * Handle API error consistently across the application
 */
export function handleApiError(
	error: any,
	endpoint: string,
	method = 'GET',
	requestData?: any,
	additionalContext?: Record<string, any>
): ApiError {
	// Create consistent ApiError object
	const apiError = createApiError(error, endpoint, method, requestData);

	// Track in Sentry if appropriate
	apiError.trackError(additionalContext);

	// Return the error for further handling
	return apiError;
}
