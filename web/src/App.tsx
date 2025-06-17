import { Flex, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';
import ErrorBoundary from './ErrorBoundary';
import { FullscreenLoader } from './components/FullscreenLoader';
import { GlobalModals } from './components/GlobalModals';
import { FileSystemContext } from './context/FileSystemContext';
import { IModalContext, ModalContext } from './context/ModalContext';
import { UserContext } from './context/UserContext';
import { FirebaseContext } from './firebase/FirebaseContext';
import { Firebase } from './firebase/firebase';
import { FirebaseUser } from './firebase/firebaseTypes';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { IUserProfile } from './models/UserProfile';
import { NewLogin } from './pages/NewLogin';
import { useProjectTypes } from './queries/useProjectTypes';
import { useVerify } from './queries/useVerify';
import { FileSystemService } from './services/FileSystemService';
import { Onboarding } from './pages/Onboarding';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url
).toString();

type Intercom = (type: 'boot', options: Record<string, unknown>) => void;
declare const window: Window & { Intercom: Intercom };

export const AppPreloader = (): JSX.Element => {
	const firebase: Firebase = useContext(FirebaseContext);
	const [hasError, setHasError] = useState(false);
	const { authUser, loading: isLoadingFirebase } = useFirebaseAuth(firebase.auth);
	const { mutateAsync: verify, data, isPending: loading, error } = useVerify();

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
			name: data?.name, // Full name
			email: data?.userName, // Email address
			user_id: authUser?.uid,
			phone_number: data?.phoneNumber
		};

		window.Intercom('boot', {
			app_id: 'jsp3pks1',
			alignment: 'right', // This aligns the widget to the right

			...userProperties
		});
	}, [authUser?.uid, data]);

	useEffect(() => {
		if (error) {
			setHasError(true);
		}
	}, [error]);

	// one preview deployment was displaying infinite loading spinner
	// this might be good to have 😬
	console.log({ loading, isLoadingFirebase, data });

	if (loading || isLoadingFirebase) {
		return <FullscreenLoader />;
	}

	const user = {
		registered: data?.registered ?? false,
		type: data?.type ?? 0,
		email: data?.email ?? '',
		authenticated: data?.authenticated ?? false,
		avatar: data?.avatar ?? '',
		name: data?.name ?? '',
		userName: data?.userName ?? '',
		phoneNumber: data?.phoneNumber ?? ''
	};

	if (hasError) {
		return (
			<Flex justifyContent={'center'} alignItems={'center'}>
				<Text>The server is down for maintenance, please try again later.</Text>
			</Flex>
		);
	}

	return <App userProfile={user} authUser={authUser} />;
};

const App = ({
	userProfile,
	authUser
}: {
	userProfile?: IUserProfile;
	authUser: FirebaseUser | null;
}): JSX.Element => {
	// set up filesystem
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
								<ErrorBoundary>
									<GlobalModals />
									<Routes>
										{userProfile?.registered === false && (
											<Route path={'/onboarding'} element={<Onboarding />} />
										)}
										<Route path={'/*'} element={<AuthenticatedRoutes />} />
									</Routes>
								</ErrorBoundary>
							</ModalContext.Provider>
						</FileSystemContext.Provider>
					</UserContext.Provider>
				</QueryParamProvider>
			) : (
				<Routes>
					<Route path={'*'} element={<NewLogin />} />
				</Routes>
			)}
		</Router>
	);
};

export default App;
