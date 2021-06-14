/* eslint-disable */
export const devError = (arg1: any, arg2?: any, arg3?: any): void => {
	// @ts-ignore
	console.error.apply(this, arguments);
};

export const devInfo = (arg1: any, arg2?: any, arg3?: any): void => {
	if (process.env.ENVIRONMENT !== 'production') {
		// @ts-ignore
		console.info.apply(this, arguments);
	}
};
