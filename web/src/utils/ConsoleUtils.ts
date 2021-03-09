/* eslint-disable */
export const devError = (arg1: any, arg2?: any, arg3?: any): void => {
	// @ts-ignore
	console.error.apply(this, arguments);
};
