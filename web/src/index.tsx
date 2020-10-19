import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { AppPreloader } from './App';
import { Firebase } from './firebase/firebase';
import { FirebaseContext } from './firebase/FirebaseContext';
import { ReactQueryConfigProvider } from 'react-query';
import { axiosQueryFetcher } from './queries/axiosQueryFetcher';
import { ThemeProvider } from 'styled-components';
import { Theme } from './Theme';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const firebaseApp = new Firebase();

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={Theme}>
			<FirebaseContext.Provider value={firebaseApp}>
				<ReactQueryConfigProvider
					config={{
						queries: {
							queryFn: axiosQueryFetcher,
							refetchOnWindowFocus: false
						}
					}}
				>
					<AppPreloader />
				</ReactQueryConfigProvider>
			</FirebaseContext.Provider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('gigover-root')
);
