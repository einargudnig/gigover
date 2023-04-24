/* eslint-disable */
export const devError = (...args: any[]): void => {
	// @ts-ignore
	console.error(...args);
};

export const devInfo = (...args: any[]): void => {
	if (process.env.ENVIRONMENT !== 'production') {
		// @ts-ignore
		console.info(...args);
	}
};
