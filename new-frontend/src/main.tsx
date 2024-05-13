import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ChakraThemeColors } from './theme';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntercomProvider } from 'react-use-intercom';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyAS-XYBiGnAMdLORL1ctzYgN81pwargt80',
	authDomain: 'gigover2.firebaseapp.com',
	databaseURL: 'https://gigover2.firebaseio.com',
	projectId: 'gigover2',
	storageBucket: 'gigover2.appspot.com',
	messagingSenderId: '761785841920',
	appId: '1:761785841920:web:477d337ae42115c2621be5',
	measurementId: 'G-C5KYRDS14C'
};

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

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
