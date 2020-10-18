export const intToString = (value: number) => {
	const suffixes = ['', 'k', 'm', 'b', 't'];
	const suffixNum = Math.floor(('' + value).length / 3);
	let shortValue: number | string = parseFloat(
		(suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
	);
	if (shortValue % 1 !== 0) {
		shortValue = shortValue.toFixed(1);
	}
	return shortValue + suffixes[suffixNum];
};

export const secondsToString = (seconds: number): string => {
	const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);

	return hours + ' hours ' + minutes + ' minutes';
};

export const secondsToHours = (seconds: number): number => {
	const secs = seconds / 1000;
	return Math.floor(((secs % 31536000) % 86400) / 3600);
};

export const secondsToMinutes = (seconds: number): number => {
	const secs = seconds / 1000;
	return Math.floor((((secs % 31536000) % 86400) % 3600) / 60);
};
