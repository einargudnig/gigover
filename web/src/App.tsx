import React, { useContext, useEffect, useState } from 'react';
import 'normalize.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';
import { IUserProfile } from './models/UserProfile';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { UserContext } from './context/UserContext';
import { FullscreenLoader } from './components/FullscreenLoader';
import { Organize } from './pages/Organize';
import { TimeTracker } from './pages/TimeTracker';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { IModalContext, ModalContext } from './context/ModalContext';
import { GlobalModals } from './components/GlobalModals';
import { useVerify } from './queries/useVerify';

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const { authUser, loading: isLoadingFirebase } = useFirebaseAuth(firebase.auth);
	const [verify, { data: userProfile, isLoading: loading, error }] = useVerify();

	useEffect(() => {
		if (authUser) {
			authUser.getIdToken().then((token) => {
				verify({
					token
				});
			});
		}
	}, [authUser, verify]);

	if (loading || isLoadingFirebase) {
		return <FullscreenLoader />;
	}

	if (error) {
		return <p>Error in auth check</p>;
	}

	return <App authenticated={Boolean(authUser)} userProfile={userProfile} />;
};

const App = ({
	authenticated,
	userProfile
}: {
	authenticated: boolean;
	userProfile?: IUserProfile;
}): JSX.Element => {
	const [modalContext, setModalContext] = useState<IModalContext>({ registered: true });

	useEffect(() => {
		console.log('in here');
		if (userProfile) {
			setModalContext({
				registered: userProfile.registered
			});
		}

		console.log(modalContext);
	}, [userProfile]);

	return (
		<Router>
			<Routes>
				{authenticated && userProfile ? (
					<ModalContext.Provider value={[modalContext, setModalContext]}>
						<UserContext.Provider value={userProfile}>
							<GlobalModals>
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
							</GlobalModals>
						</UserContext.Provider>
					</ModalContext.Provider>
				) : (
					<Route path={'*'} element={<Login />} />
				)}
			</Routes>
		</Router>
	);
};

export default App;
