/**
 * Function that converts a word into a color, for labels and such.
 * @param str Text to generate color from
 * @param s Saturation
 * @param l Lightness
 */
const stringToHslColor = (str: string, s: number, l: number) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	const h = hash % 360;
	return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

export interface GeneratedColor {
	backgroundColor: string;
	textColor: string;
}

export const colorGenerator = (text: string, saturation = 45, light = 80): GeneratedColor => {
	const backgroundColor = stringToHslColor(text, saturation, light);
	const textColor = stringToHslColor(text, saturation, light / 2);

	return {
		backgroundColor,
		textColor
	};
};
