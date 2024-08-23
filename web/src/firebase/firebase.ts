import 'firebase/analytics';
import app from 'firebase/app';
import 'firebase/auth';

const config = {
	apiKey: 'AIzaSyAS-XYBiGnAMdLORL1ctzYgN81pwargt80',
	authDomain: 'web.gigover.com',
	databaseURL: 'https://gigover2-files.europe-west1.firebasedatabase.app',
	projectId: 'gigover2',
	storageBucket: 'gigover2.appspot.com',
	messagingSenderId: '761785841920',
	appId: '1:761785841920:web:6fe3194e754695b3621be5'
};

console.log('firebase config', { config });
app.initializeApp(config);
console.log('firebase after init', { app });

export class Firebase {
	public auth: app.auth.Auth;
	public authProvider: app.auth.GoogleAuthProvider;
	public analytics: app.analytics.Analytics;

	constructor() {
		this.auth = app.auth();
		this.analytics = app.analytics();
		this.authProvider = new app.auth.GoogleAuthProvider();
	}

	user = async (): Promise<app.User | null> => {
		await this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
		console.log('this.authenticated.currentUser', this.auth.currentUser);
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

	resetPassword = (email: string): Promise<void> => {
		return this.auth.sendPasswordResetEmail(email);
	};

	signOut = (): Promise<void> => this.auth.signOut();
}
