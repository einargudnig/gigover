import app from 'firebase';
import 'firebase/auth';
import 'firebase/analytics';

const config = {
	apiKey: 'AIzaSyAS-XYBiGnAMdLORL1ctzYgN81pwargt80',
	authDomain: 'gigover2.firebaseapp.com',
	databaseURL: 'https://gigover2.firebaseio.com',
	projectId: 'gigover2',
	storageBucket: 'gigover2.appspot.com',
	messagingSenderId: '761785841920',
	appId: '1:761785841920:web:6fe3194e754695b3621be5'
};

export class Firebase {
	public auth: app.auth.Auth;
	public authProvider: app.auth.GoogleAuthProvider;
	public analytics: app.analytics.Analytics;

	constructor() {
		app.initializeApp(config);
		this.auth = app.auth();
		this.analytics = app.analytics();
		this.authProvider = new app.auth.GoogleAuthProvider();

		this.auth.onAuthStateChanged(this.authStateChanged);
	}

	authStateChanged = async (user: app.User | null): Promise<void> => {
		console.log('Auth state changed', user);
		await this.auth.updateCurrentUser(user);
	};

	user = async (): Promise<app.User | null> => {
		await this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
		return this.auth.currentUser;
	};

	signInWithGoogle = async (): Promise<app.auth.UserCredential> => {
		await this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
		return this.auth.signInWithPopup(this.authProvider);
	};

	signInWithEmailAndPassword = (
		email: string,
		password: string
	): Promise<app.auth.UserCredential> => {
		return this.auth.signInWithEmailAndPassword(email, password);
	};

	signOut = (): Promise<void> => this.auth.signOut();
}
