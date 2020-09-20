import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { AppPreloader } from './App';
import { Firebase } from './firebase/firebase';
import { FirebaseContext } from './firebase/FirebaseContext';

ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={new Firebase()}>
			<AppPreloader />
		</FirebaseContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
