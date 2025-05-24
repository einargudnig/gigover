import { getAnalytics, type Analytics } from 'firebase/analytics';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
	GoogleAuthProvider,
	browserLocalPersistence,
	createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
	signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
	signOut as firebaseSignOut,
	getAuth,
	sendPasswordResetEmail,
	setPersistence,
	signInWithPopup,
	type Auth,
	type User,
	type UserCredential
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAS-XYBiGnAMdLORL1ctzYgN81pwargt80',
	authDomain: 'web.gigover.com',
	databaseURL: 'https://gigover2-files.europe-west1.firebasedatabase.app',
	projectId: 'gigover2',
	storageBucket: 'gigover2.appspot.com',
	messagingSenderId: '761785841920',
	appId: '1:761785841920:web:6fe3194e754695b3621be5'
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const authInstance: Auth = getAuth(app);
const analyticsInstance: Analytics = getAnalytics(app);
const googleAuthProviderInstance: GoogleAuthProvider = new GoogleAuthProvider();

// Set persistence for auth
setPersistence(authInstance, browserLocalPersistence).catch((error) => {
	console.error('Firebase: Error setting persistence', error);
});

export const getCurrentUser = (): User | null => {
	return authInstance.currentUser;
};

export const doSignInWithGoogle = async (): Promise<UserCredential> => {
	return signInWithPopup(authInstance, googleAuthProviderInstance);
};

export const doSignInWithEmailAndPassword = async (
	email: string,
	password: string
): Promise<UserCredential> => {
	return firebaseSignInWithEmailAndPassword(authInstance, email, password);
};

export const doCreateUserWithEmailAndPassword = async (
	email: string,
	password: string
): Promise<UserCredential> => {
	return firebaseCreateUserWithEmailAndPassword(authInstance, email, password);
};

export const doResetPassword = async (email: string): Promise<void> => {
	return sendPasswordResetEmail(authInstance, email);
};

export const doSignOut = async (): Promise<void> => {
	return firebaseSignOut(authInstance);
};

export {
	app,
	authInstance as auth,
	analyticsInstance as analytics,
	googleAuthProviderInstance as googleAuthProvider
};

// This class is kept for now to minimize immediate breaking changes elsewhere.
// Gradually refactor components to use the exported functions directly.
export class Firebase {
	public auth: Auth;
	public authProvider: GoogleAuthProvider;
	public analytics: Analytics;

	constructor() {
		this.auth = authInstance;
		this.analytics = analyticsInstance;
		this.authProvider = googleAuthProviderInstance;
	}

	user = async (): Promise<User | null> => {
		return getCurrentUser();
	};

	signInWithGoogle = async (): Promise<UserCredential> => {
		return doSignInWithGoogle();
	};

	signInWithEmailAndPassword = (email: string, password: string): Promise<UserCredential> => {
		return doSignInWithEmailAndPassword(email, password);
	};

	createUserWithEmailAndPassword = (email: string, password: string): Promise<UserCredential> => {
		return doCreateUserWithEmailAndPassword(email, password);
	};

	resetPassword = (email: string): Promise<void> => {
		return doResetPassword(email);
	};

	signOut = (): Promise<void> => doSignOut();
}
