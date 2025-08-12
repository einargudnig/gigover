import * as Sentry from '@sentry/react';
import { showFeedbackDialog } from '../sentry';

/**
 * Utility functions for working with Sentry
 */

/**
 * Adds a breadcrumb to help trace user actions leading to an error
 *
 * @param category The category of the breadcrumb
 * @param message The message to record
 * @param data Optional additional data
 * @param level The severity level
 */
export const addBreadcrumb = (
	category: string,
	message: string,
	data?: Record<string, any>,
	level: Sentry.SeverityLevel = 'info'
) => {
	Sentry.addBreadcrumb({
		category,
		message,
		data,
		level
	});
};

/**
 * Capture non-fatal application messages or warnings
 *
 * @param message The message to capture
 * @param level The severity level
 * @param extra Optional additional context
 */
export const captureMessage = (
	message: string,
	level: Sentry.SeverityLevel = 'info',
	extra?: Record<string, any>
) => {
	Sentry.captureMessage(message, {
		level,
		extra
	});
};

/**
 * Set extra context for the current user session
 *
 * @param key Context key
 * @param value Context value
 */
export const setContext = (key: string, value: Record<string, any>) => {
	Sentry.setContext(key, value);
};

/**
 * Set a tag for easier error filtering
 *
 * @param key Tag key
 * @param value Tag value
 */
export const setTag = (key: string, value: string) => {
	Sentry.setTag(key, value);
};

/**
 * Manually capture an exception with additional context
 *
 * @param error The error object
 * @param extra Optional additional context
 * @returns The generated event ID that can be used for user feedback
 */
export const captureException = (error: Error, extra?: Record<string, any>): string => {
	const eventId = Sentry.captureException(error, { extra });
	return eventId;
};

/**
 * Tracks a workflow step with appropriate context
 *
 * @param workflowName Name of the workflow (e.g., "project_creation")
 * @param step Current step in the workflow
 * @param data Additional context data relevant to this step
 */
export const trackWorkflow = (workflowName: string, step: string, data?: Record<string, any>) => {
	// Add a breadcrumb for the workflow step
	addBreadcrumb('workflow', `${workflowName}: ${step}`, data);

	// Add workflow context for any errors that might occur
	setContext('workflow', {
		name: workflowName,
		step: step,
		data: data
	});

	// Set a tag for easier filtering
	setTag('workflow', workflowName);
};

/**
 * Capture API error and show feedback dialog if severe
 *
 * @param error The API error
 * @param endpoint The API endpoint that failed
 * @param showDialog Whether to show the feedback dialog
 * @returns The generated event ID
 */
export const captureApiError = (error: Error, endpoint: string, showDialog = false): string => {
	// Add API context
	setContext('api', {
		endpoint,
		statusCode: (error as any).statusCode || (error as any).status || 'unknown',
		method: (error as any).method || 'unknown'
	});

	// Mark as API error for fingerprinting
	if (error.name !== 'ApiError') {
		const apiError = new Error(`API Error: ${endpoint} - ${error.message}`);
		apiError.name = 'ApiError';
		apiError.stack = error.stack;
		error = apiError;
	}

	// Capture the exception
	const eventId = captureException(error);

	// Show feedback dialog for severe errors if requested
	if (showDialog) {
		showFeedbackDialog(eventId);
	}

	return eventId;
};

/**
 * Track a significant user interaction
 *
 * @param action The action performed
 * @param category The category of the action
 * @param data Additional data about the interaction
 */
export const trackUserAction = (action: string, category: string, data?: Record<string, any>) => {
	addBreadcrumb(category, action, data);
};

// Export feedback dialog function for convenience
export { showFeedbackDialog };
