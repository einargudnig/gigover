import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import 'core-js/stable';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import * as ReactDOMClient from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'react-tippy/dist/tippy.css';
import { ThemeProvider } from 'styled-components';
import { AppPreloader } from './App';
import ErrorBoundary from './ErrorBoundary';
import { ChakraThemeColors, Theme } from './Theme';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';
import { axiosQueryFetcher } from './queries/axiosQueryFetcher';
import './styles/index.css';

const firebaseApp = new Firebase();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			queryFn: axiosQueryFetcher as any,
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

const container = document.getElementById('gigover-root');
const root = ReactDOMClient.createRoot(container);

root.render(
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
);
