import { onAuthStateChanged, type Auth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FirebaseUser } from '../firebase/firebaseTypes';

export const useFirebaseAuth = (auth: Auth) => {
	const [loading, setLoading] = useState(true);
	const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
			if (user) {
				setAuthUser(user);
			} else {
				setAuthUser(null);
			}

			setLoading(false);
		});
		return () => {
			unsubscribe();
		};
	}, [auth]);

	return {
		loading,
		authUser
	};
};
