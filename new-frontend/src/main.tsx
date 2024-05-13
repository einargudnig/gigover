import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ChakraThemeColors } from './theme';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntercomProvider } from 'react-use-intercom';

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

const INTERCOM_APP_ID = 'jsp3pks1';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<IntercomProvider appId={INTERCOM_APP_ID} autoBoot={true}>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<ChakraProvider theme={ChakraTheme}>
						<App />
					</ChakraProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</IntercomProvider>
	</React.StrictMode>
);
