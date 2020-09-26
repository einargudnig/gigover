import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { FirebaseUser } from './firebase/firebaseTypes';

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const { authUser, loading: isLoadingFirebase } = useFirebaseAuth(firebase.auth);
	const [verify, { data: userProfile, isLoading: loading, error }] = useVerifyDevWorker();

	useEffect(() => {
		if (authUser) {
			authUser.getIdToken().then(async (token) => {
				// TODO Replace with Non-debug call
				// verify({
				// 	token
				// });
				await verify();
			});
		}
	}, [authUser, verify]);

	if (loading || isLoadingFirebase) {
		return <FullscreenLoader />;
	}

	if (error) {
		return <p>Error in auth check</p>;
	}

	return <App userProfile={userProfile} authUser={authUser} />;
};

const App = ({
	userProfile,
	authUser
}: {
	userProfile?: IUserProfile;
	authUser: FirebaseUser | null;
}): JSX.Element => {
	const [modalContext, setModalContext] = useState<IModalContext>({ registered: true });

	useEffect(() => {
		if (userProfile) {
			setModalContext({
				registered: userProfile.registered
			});
		}
	}, [userProfile]);

	const user = useMemo(() => {
		if (authUser && userProfile) {
			return {
				...userProfile,
				avatar: authUser.photoURL || ''
			};
		}
		return null;
	}, [authUser, userProfile]);

	return (
		<Router>
			{user !== null ? (
				<ModalContext.Provider value={[modalContext, setModalContext]}>
					<UserContext.Provider value={user}>
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
