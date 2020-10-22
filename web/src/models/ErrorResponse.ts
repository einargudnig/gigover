export interface ErrorResponse {
	errorCode: string;
	errorText: string;
}

export const ErrorTypes = {
	NOT_REGISTERED: 'NOT_REGISTERED',
	NOT_LOGGED_IN: 'NOT_LOGGED_IN',
	OK: 'OK',
	DATA_STORE_EXCEPTION: 'DATA_STORE_EXCEPTION'
} as const;
