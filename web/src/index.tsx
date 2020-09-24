import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { AppPreloader } from './App';
import { Firebase } from './firebase/firebase';
import { FirebaseContext } from './firebase/FirebaseContext';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { axiosQueryFetcher } from './queries/axiosQueryFetcher';
import { ThemeProvider } from 'styled-components';

const queryCache = new QueryCache({
	defaultConfig: {
		queries: {
			queryFn: axiosQueryFetcher,
			refetchOnWindowFocus: false
		}
	}
});

// TODO Fix ThemeProvider

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider
			theme={{
				black: '#000',
				white: '#fff'
			}}
		>
			<FirebaseContext.Provider value={new Firebase()}>
				<ReactQueryCacheProvider queryCache={queryCache}>
					<AppPreloader />
				</ReactQueryCacheProvider>
			</FirebaseContext.Provider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('gigover-root')
);
