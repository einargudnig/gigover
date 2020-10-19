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

export const secondsToHHMMSS = (sec_num: number): string => {
	let hours: number | string = Math.floor(sec_num / 3600);
	let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
	let seconds: number | string = sec_num - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}

	return hours + ':' + minutes + ':' + seconds;
};

export const secondsToString = (seconds: number): string => {
	const days = Math.floor((seconds % 31536000) / 86400);
	const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);

	return (days > 0 ? days + ' days ' : '') + hours + ' hours ' + minutes + ' minutes';
};

export const secondsToHours = (seconds: number): number => {
	const secs = seconds / 1000;
	return Math.floor(((secs % 31536000) % 86400) / 3600);
};

export const secondsToMinutes = (seconds: number): number => {
	const secs = seconds / 1000;
	return Math.floor((((secs % 31536000) % 86400) % 3600) / 60);
};
