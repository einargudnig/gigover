import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'core-js/stable';
// import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker?url';
import * as ReactDOMClient from 'react-dom/client';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { AppPreloader } from './App';
import ErrorBoundary from './ErrorBoundary';
import { ChakraThemeColors } from './Theme';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';
import { axiosQueryFetcher } from './queries/axiosQueryFetcher';
import './styles/index.css';
import initMocks from './mocks/handlers/mocks';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const firebaseApp = new Firebase();

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

initMocks().then(() => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				queryFn: axiosQueryFetcher as any,
				refetchOnWindowFocus: false
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
});
