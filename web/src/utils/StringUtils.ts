import { format } from 'date-fns';

export const SubstringText = (text: string, maxLength: number) => {
	const addition = '..';

	if (text.length > maxLength) {
		return text.substr(0, maxLength - addition.length) + addition;
	}

	return text;
};

export const formatDate = (date: Date): string => format(date, 'do LLL yyyy @ kk:mm');

export const validateEmail = (email: string): boolean => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};
