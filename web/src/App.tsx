import React, { useContext, useEffect, useState } from 'react';
import 'normalize.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FirebaseUser } from './firebase/firebaseTypes';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		if (loading) {
			const checkForCredentials = async () => {
				const result = await firebase.user();
				// eslint-disable-next-line no-console
				console.log('AuthResult', result);
				setAuthenticated(result);
				setLoading(false);
			};

			checkForCredentials();
		}
	}, [loading]);

	if (loading) {
		return <p>Loading</p>;
	}

	return <App authenticated={Boolean(authenticated)} />;
};

const App = ({ authenticated }: { authenticated: boolean }): JSX.Element => {
	return (
		<Router>
			<Routes>
				<Route path={'g'} element={<Dashboard />}>
					<Route path={'/'} element={<Dashboard />} />
				</Route>
				<Route path={'/'} element={<Login />} />
			</Routes>
		</Router>
	);
};

export default App;
