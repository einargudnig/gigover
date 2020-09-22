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
import { UserContext } from './context/UserContext';
import { FullscreenLoader } from './components/FullscreenLoader';
import { Organize } from './pages/Organize';
import { TimeTracker } from './pages/TimeTracker';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

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

		// Check if the Firebase credentials are legit
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
			checkAuthToken(authUser);
		} else {
			setUserProfile(null);
			setLoading(false);
		}
	}, [authUser]);

	if (loading || isLoadingFirebase) {
		return <FullscreenLoader />;
	}

	if (error) {
		return <p>Error in auth check</p>;
	}

	return (
		<ReactQueryCacheProvider queryCache={queryCache}>
			<App authenticated={Boolean(authUser)} userProfile={userProfile} />
		</ReactQueryCacheProvider>
	);
};

const App = ({
	authenticated,
	userProfile
}: {
	authenticated: boolean;
	userProfile: IUserProfile | null;
}): JSX.Element => {
	return (
		<UserContext.Provider value={userProfile}>
			<Router>
				<Routes>
					{authenticated ? (
						<>
							<Route path={'/'} element={<Dashboard />} />
							<Route path={'organize'} element={<Organize />}>
								<Route path={':projectId'} element={<Organize />} />
							</Route>
							<Route path={'time-tracker'} element={<TimeTracker />}>
								<Route path={':projectId'} element={<TimeTracker />} />
							</Route>
							<Route path={'users'} element={<Users />}>
								<Route path={':userId'} element={<Users />} />
							</Route>
							<Route path={'settings'} element={<Settings />} />
							<Route path={'project'} element={<Dashboard />}>
								<Route path={':id'} element={<Dashboard />} />
							</Route>
						</>
					) : (
						<Route path={'*'} element={<Login />} />
					)}
				</Routes>
			</Router>
		</UserContext.Provider>
	);
};

export default App;
