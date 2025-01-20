import { format } from 'date-fns';

export const SubstringText = (text: string, maxLength: number) => {
	const addition = '..';

	if (text?.length > maxLength) {
		return text.substr(0, maxLength - addition.length) + addition;
	}

	return text;
};

export const formatDate = (date: Date): string => format(date, 'dd. MMM yyyy kk:mm');
export const formatDateWithoutTime = (date: Date): string => format(date, 'dd. MMM yyyy');
export const formatDateWithoutYear = (date: Date): string => format(date, 'dd. MMM');
export const formatHours = (date: Date): string => format(date, 'kk:mm');

export const validateEmail = (email: string): boolean => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

export const isSameDateAs = (d1: Date, d2: Date) => {
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
};

export const showTimeSheetRange = (date: Date, date2: Date): string => {
	if (isSameDateAs(date, date2)) {
		return formatDate(date) + '-' + formatHours(date2);
	}

	return formatDate(date) + ' to ' + formatDate(date2);
};
