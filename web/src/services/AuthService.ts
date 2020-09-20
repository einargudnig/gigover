export const AuthKey = 'gigover-auth-data';

export class AuthService {

	static updateAuthData(data: Record<string, unknown>) {
		localStorage.setItem(AuthKey, JSON.stringify(data));
	}
}
