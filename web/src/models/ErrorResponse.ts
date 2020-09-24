export interface ErrorResponse {
	errorCode: string;
	errorText: string;
}

export const ErrorTypes = {
	NOT_REGISTERED: 'NOT_REGISTERED'
} as const;
