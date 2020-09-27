export const Theme = {
	colors: {
		black: '#000',
		white: '#fff',
		green: '#1FDF83',
		darkGreen: '#099340',
		darkBlue: '#071029',
		darkLightBlue: '#A0ADCD',
		blueBackground: '#f4f7fc',
		border: '#e0e5f2',
		grayBackground: '#F8F8F8',
		red: '#DE2727'
	},
	padding: (modifier: number): string => `${modifier * 8}px`
};
