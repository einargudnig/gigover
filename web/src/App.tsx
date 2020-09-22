import React, { useContext, useEffect, useState } from 'react';
import 'normalize.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FirebaseUser } from './firebase/firebaseTypes';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ApiService } from './services/ApiService';
import { IUserProfile } from './models/UserProfile';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

const queryCache = new QueryCache();

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Firebase Auth User
	const { authUser, loading: isLoadingFirebase } = useFirebaseAuth(firebase.auth);
	// User profile from Gigover
	const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

	useEffect(() => {
		setLoading(true);

		const checkAuthToken = async (user: FirebaseUser) => {
			try {
				const token = await user.getIdToken();
				const userData = await ApiService.checkAuthToken(token);
				if (userData === null) {
					setUserProfile(null);
				} else {
					setUserProfile(userData);
				}
			} catch (e) {
				console.log(e);
				//setError(e.toString);
			}

			setLoading(false);
		};

		if (authUser !== null) {
			console.log('Going in here');
			checkAuthToken(authUser);
		} else {
			setUserProfile(null);
			setLoading(false);
		}
	}, [authUser]);

	if (loading || isLoadingFirebase) {
		return <p>Loading</p>;
	}

	if (error) {
		return <p>Error in auth check</p>;
	}

	return (
		<ReactQueryCacheProvider queryCache={queryCache}>
			<App authenticated={Boolean(authUser)} />
		</ReactQueryCacheProvider>
	);
};

const App = ({ authenticated }: { authenticated: boolean }): JSX.Element => {
	return (
		<Router>
			<Routes>
				{authenticated ? (
					<Route path={'g'} element={<Dashboard />}>
						<Route path={'/'} element={<Dashboard />} />
					</Route>
				) : (
					<Route path={'*'} element={<Login />} />
				)}
			</Routes>
		</Router>
	);
};

export default App;
