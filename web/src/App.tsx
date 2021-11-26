import 'normalize.css';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { useVerify } from './queries/useVerify';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';
import { FirebaseUser } from './firebase/firebaseTypes';
import { useProjectTypes } from './queries/useProjectTypes';
import { QueryParamProvider } from 'use-query-params';
import { FileSystemContext } from './context/FileSystemContext';
import { FileSystemService } from './services/FileSystemService';
import { pdfjs } from 'react-pdf';
import ErrorBoundary from './ErrorBoundary';

// We need this for loading PDF viewer on production.
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Intercom = (type: 'boot', options: Record<string, unknown>) => void;
declare const window: Window & { Intercom: Intercom };

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const { authUser, loading: isLoadingFirebase } = useFirebaseAuth(firebase.auth);
	const { mutateAsync: verify, data, isLoading: loading, error } = useVerify();

	// Load Project Types
	useProjectTypes();

	useEffect(() => {
		if (authUser) {
			authUser.getIdToken().then(async (token) => {
				await verify(token);
			});
		}
	}, [authUser, verify]);

	useEffect(() => {
		const userProperties = {
			name: data?.data.name, // Full name
			email: data?.data?.userName, // Email address
			user_id: authUser?.uid,
			phone_number: data?.data.phoneNumber
		};

		window.Intercom('boot', {
			app_id: 'jsp3pks1',
			...userProperties
		});
	}, [authUser?.uid, data]);

	if (loading || isLoadingFirebase) {
		return <FullscreenLoader />;
	}

	if (error) {
		throw new Error('The server is down for maintenance, please try again later.');
	}

	return <App userProfile={data?.data} authUser={authUser} />;
};

const App = ({
	userProfile,
	authUser
}: {
	userProfile?: IUserProfile;
	authUser: FirebaseUser | null;
}): JSX.Element => {
	const fileSystem = useMemo(() => new FileSystemService(), []);
	const modalContext = useState<IModalContext>(
		userProfile ? { registered: userProfile.registered } : {}
	);

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
				<QueryParamProvider>
					<UserContext.Provider value={user}>
						<FileSystemContext.Provider value={fileSystem}>
							<ModalContext.Provider value={modalContext}>
								<ErrorBoundary withPage={true}>
									<GlobalModals />
									<AuthenticatedRoutes />
								</ErrorBoundary>
							</ModalContext.Provider>
						</FileSystemContext.Provider>
					</UserContext.Provider>
				</QueryParamProvider>
			) : (
				<Routes>
					<Route path={'*'} element={<Login />} />
				</Routes>
			)}
		</Router>
	);
};

export default App;
