export const ChakraThemeColors = {
	brand: {
		900: '#000',
		800: '#999',
		700: '#666'
	},
	black: {
		900: '#000',
		800: '#000',
		700: '#000',
		600: '#000',
		500: '#000',
		400: '#000',
		300: '#000',
		200: '#000',
		100: '#000'
	},
	whitebtn: {
		900: '#fff',
		800: '#fff',
		700: '#fff',
		600: '#fff',
		500: '#fff',
		400: '#fff', // Background
		300: '#fff',
		200: '#fff',
		100: '#fff'
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
	},
	yellow: {
		900: '#f8db14',
		800: '#f9de27',
		700: '#f9e13a',
		600: '#fae44d',
		500: '#fbe760',
		400: '#fbea73',
		300: '#fced86',
		200: '#fcf099',
		100: '#fdf2ac'
	}
};

export const Theme = {
	colors: {
		black: '#000',
		white: '#fff',
		yellow: ChakraThemeColors.yellow['600'],
		green: ChakraThemeColors.green['600'],
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
	boxShadow: (opacity = '0.03'): string => `5px 5px 25px rgba(0, 0, 0, ${opacity})`,
	padding: (modifier: number): string => `${modifier * 8}px`
};
