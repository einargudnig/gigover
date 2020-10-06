export const SubstringText = (text: string, maxLength: number) => {
	const addition = '..';

	if (text.length > maxLength) {
		return text.substr(0, maxLength - addition.length) + addition;
	}

	return text;
};
