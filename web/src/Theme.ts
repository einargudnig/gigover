export const ChakraThemeColors = {
	brand: {
		900: '#000',
		800: '#999',
		700: '#666'
	},
	green: {
		900: '#094327',
		800: '#107042',
		700: '#169d5c',
		600: '#1cc976',
		500: '#36e390',
		400: '#62e9a9',
		300: '#8fefc1',
		200: '#bcf6da',
		100: '#e9fcf3'
	}
};

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
		red: '#DE2727',
		taskBorder: '#E9E9EF',
		taskBackground: '#FBFBFC'
	},
	padding: (modifier: number): string => `${modifier * 8}px`
};
