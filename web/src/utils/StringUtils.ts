import { format } from 'date-fns';

export const SubstringText = (text: string, maxLength: number) => {
	const addition = '..';

	if (text.length > maxLength) {
		return text.substr(0, maxLength - addition.length) + addition;
	}

	return text;
};

export const formatDate = (date: Date): string => format(date, 'do LLL yyyy @ kk:mm');
