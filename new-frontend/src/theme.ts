const colors = {
	black: {
		'900': '#000',
		'800': '#000',
		'700': '#000',
		'600': '#000',
		'500': '#000',
		'400': '#000',
		'300': '#000',
		'200': '#000',
		'100': '#000'
	},
	white: {
		'900': '#fff',
		'800': '#fff',
		'700': '#fff',
		'600': '#fff',
		'500': '#fff',
		'400': '#fff',
		'300': '#fff',
		'200': '#fff',
		'100': '#fff'
	},
	gray: {
		'900': '#323232',
		'800': '#3c3c3c',
		'700': '#454545',
		'600': '#4f4f4f',
		'500': '#595959',
		'400': '#636363',
		'300': '#6d6d6d',
		'200': '#E9E9E9',
		'100': '#F5F5F5'
	},
	blue: {
		'900': '#056aa5',
		'800': '#0682cc',
		'700': '#079bf2',
		'600': '#27abf9',
		'500': '#4dbafa',
		'400': '#73c9fb',
		'300': '#99d8fc',
		'200': '#bfe6fd',
		'100': '#f9fdff'
	},
	yellow: {
		'900': '#a59105',
		'800': '#ccb206',
		'700': '#f2d407',
		'600': '#f9de27',
		'500': '#FAE44D',
		'400': '#fbea73',
		'300': '#fcf099',
		'200': '#fdf5bf',
		'100': '#fefbe6'
	},
	green: {
		'900': '#0c5532',
		'800': '#117846',
		'700': '#18ab65',
		'600': '#1dce79',
		'500': '#1FDF83',
		'400': '#2fe28d',
		'300': '#52e7a0',
		'200': '#74ecb3',
		'100': '#b9f5d9'
	}
};

export type ColorKey = keyof typeof colors;

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
	},
	border: '#e0e5f2'
};

export const Theme = {
	// colors: {
	// 	black: '#000',
	// 	white: '#fff',
	// 	yellow: ChakraThemeColors.yellow['600'],
	// 	green: ChakraThemeColors.green['600'],
	// 	darkGreen: '#099340',
	// 	darkBlue: '#071029',
	// 	darkLightBlue: '#A0ADCD',
	// 	blueBackground: '#f4f7fc',
	// 	border: ChakraThemeColors.border,
	// 	grayBackground: '#F8F8F8',
	// 	red: '#DE2727',
	// 	taskBorder: '#E9E9EF',
	// 	taskBackground: '#FBFBFC'
	// },
	colors,
	backgroundColors: {
		black: colors.black['500'],
		white: colors.white['500'],
		gray: colors.gray['100'],
		yellow: colors.yellow['500'],
		green: colors.green['500'],
		blue: colors.blue['500']
	},
	fontColors: {
		heading: {
			h1: colors.black['500'],
			h2: colors.black['500'],
			h3: colors.black['500'],
			h4: colors.black['500'],
			h5: colors.gray['500']
		},
		paragraph: colors.gray['500'],
		link: colors.blue['500'],
		// All base colors must be implemented
		bg: {
			black: colors.white['500'],
			white: colors.black['500'],
			gray: colors.black['500'],
			blue: colors.white['500'],
			yellow: colors.black['500'],
			green: colors.black['500']
		}
	},
	borderRadius: '12px',
	boxShadow: (opacity = '0.03'): string => `5px 5px 25px rgba(0, 0, 0, ${opacity})`,
	padding: (modifier: number): string => `${modifier * 8}px`
};
