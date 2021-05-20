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
import ErrorBoundary from './ErrorBoundary';
import 'react-tippy/dist/tippy.css';

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
				focusBorderColor: 'yellow.600',
				colorScheme: 'yellow'
			}
		},
		Textarea: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'black'
				}
			},
			defaultProps: {
				focusBorderColor: 'yellow.600',
				colorScheme: 'yellow'
			}
		},
		NumberInput: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'black'
				}
			},
			defaultProps: {
				focusBorderColor: 'yellow.600',
				colorScheme: 'yellow'
			}
		},
		Button: {
			defaultProps: {
				colorScheme: 'yellow'
			}
		}
	}
});

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary>
			<ThemeProvider theme={Theme}>
				<ChakraProvider theme={ChakraTheme}>
					<FirebaseContext.Provider value={firebaseApp}>
						<QueryClientProvider client={queryClient}>
							<AppPreloader />
						</QueryClientProvider>
					</FirebaseContext.Provider>
				</ChakraProvider>
			</ThemeProvider>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById('gigover-root')
);
