import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'core-js/stable';
import * as ReactDOMClient from 'react-dom/client';
import { AppPreloader } from './App';
import ErrorBoundary from './ErrorBoundary';
import { ChakraThemeColors } from './Theme';
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
if (container) {
	const root = ReactDOMClient.createRoot(container);

	root.render(
		<ErrorBoundary>
			<ChakraProvider theme={ChakraTheme}>
				<FirebaseContext.Provider value={firebaseApp}>
					<QueryClientProvider client={queryClient}>
						<AppPreloader />
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</FirebaseContext.Provider>
			</ChakraProvider>
		</ErrorBoundary>
	);
}
