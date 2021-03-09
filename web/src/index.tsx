import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { AppPreloader } from './App';
import { Firebase } from './firebase/firebase';
import { FirebaseContext } from './firebase/FirebaseContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { axiosQueryFetcher } from './queries/axiosQueryFetcher';
import { ThemeProvider } from 'styled-components';
import { ChakraThemeColors, Theme } from './Theme';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const firebaseApp = new Firebase();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: axiosQueryFetcher,
			refetchOnWindowFocus: false
		}
	}
});

const ChakraTheme = extendTheme({
	colors: ChakraThemeColors,
	components: {
		Input: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'black'
				}
			},
			defaultProps: {
				focusBorderColor: 'green.500',
				colorScheme: 'green'
			}
		},
		Button: {
			defaultProps: {
				colorScheme: 'green'
			}
		}
	}
});

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={Theme}>
			<ChakraProvider theme={ChakraTheme}>
				<FirebaseContext.Provider value={firebaseApp}>
					<QueryClientProvider client={queryClient}>
						<AppPreloader />
					</QueryClientProvider>
				</FirebaseContext.Provider>
			</ChakraProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('gigover-root')
);
