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
        '100': '#000',
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
        '100': '#fff',
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
        '100': '#F5F5F5',
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
        '100': '#f9fdff',
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
        '100': '#fefbe6',
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
        '100': '#b9f5d9',
    },
};

export type ColorKey = keyof typeof colors;

interface ThemeInterface {
    colors: {
        [key in ColorKey]: {
            [key: '900' | '800' | '700' | '600' | '500' | '400' | '200' | '100']: string;
        };
    };
    fontColors: {
        heading: {
            h1: string;
            h2: string;
            h3: string;
            h4: string;
            h5: string;
        };
        paragraph: string;
        link: string;
        bg: {
            [key in ColorKey]: string;
        };
    };
    backgroundColors: {
        [key in ColorKey]: string;
    };
    borderRadius: string;

    padding(modifier: number, sides?: number): string;
}

const theme: ThemeInterface = {
    colors,
    backgroundColors: {
        black: colors.black['500'],
        white: colors.white['500'],
        gray: colors.gray['100'],
        yellow: colors.yellow['500'],
        green: colors.green['500'],
        blue: colors.blue['500'],
    },
    fontColors: {
        heading: {
            h1: colors.black['500'],
            h2: colors.black['500'],
            h3: colors.black['500'],
            h4: colors.black['500'],
            h5: colors.gray['500'],
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
            green: colors.black['500'],
        },
    },
    borderRadius: '6px',
    padding: (modifier: number = 1, sides) =>
        `${modifier * 8}px ${(sides || sides === 0) && `${sides * 8}px` || ''}`,
};

export default theme;
