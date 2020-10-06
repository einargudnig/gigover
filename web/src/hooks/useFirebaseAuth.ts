import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { FirebaseUser } from '../firebase/firebaseTypes';

export const useFirebaseAuth = (auth: firebase.auth.Auth) => {
	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		const unlisten = auth.onAuthStateChanged((user: FirebaseUser | null) => {
			if (user) {
				setAuthUser(user);
			} else {
				setAuthUser(null);
			}

			setLoading(false);
		});
		return () => {
			unlisten();
		};
		// eslint-disable-line
	}, []);

	return {
		loading,
		authUser
	};
};
