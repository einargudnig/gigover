import { IUserProfile } from '../models/UserProfile';
import axios from 'axios';

export const API_BASE = 'https://gigover2.appspot.com/rest/';

export class ApiService {
	static checkAuthToken = async (token: string): Promise<IUserProfile | null> => {
		try {
			const response = await axios.post(`${API_BASE}user/verify`, {
				token
			});

			if (response.status === 200) {
				console.log(response.data);
				return response.data as IUserProfile;
			}

			return null;
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			throw new Error(e.toString());
		}
	};
}

// static async checkFirebaseAuthToken = (token: string): Promise<IUserProfile> => {
// 	await fetch(`${ApiService.base}user/verify`)
// 		.then
// }
