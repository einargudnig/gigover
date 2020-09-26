import React, { useContext, useEffect, useState } from 'react';
import 'normalize.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';
import { IUserProfile } from './models/UserProfile';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { UserContext } from './context/UserContext';
import { FullscreenLoader } from './components/FullscreenLoader';
import { IModalContext, ModalContext } from './context/ModalContext';
import { GlobalModals } from './components/GlobalModals';
import { useVerifyDevWorker } from './queries/useVerify';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const { authUser, loading: isLoadingFirebase } = useFirebaseAuth(firebase.auth);
	const [verify, { data: userProfile, isLoading: loading, error }] = useVerifyDevWorker();

	useEffect(() => {
		if (authUser) {
			authUser.getIdToken().then((token) => {
				// TODO Replace with Non-debug call
				// verify({
				// 	token
				// });
				verify();
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
			{authenticated && userProfile ? (
				<ModalContext.Provider value={[modalContext, setModalContext]}>
					<UserContext.Provider value={userProfile}>
						<GlobalModals>
							<AuthenticatedRoutes />
						</GlobalModals>
					</UserContext.Provider>
				</ModalContext.Provider>
			) : (
				<Routes>
					<Route path={'*'} element={<Login />} />
				</Routes>
			)}
		</Router>
	);
};

export default App;
