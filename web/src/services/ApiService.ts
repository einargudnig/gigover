import { IUserProfile } from '../models/UserProfile';
import axios from 'axios';

export const API_BASE = 'https://gigover2.appspot.com/rest/';

export const MOCK = true;

export class ApiService {
	static checkAuthToken = async (token: string): Promise<IUserProfile | null> => {
		try {
			// TODO REMOVE MOCK CODE
			if (MOCK) {
				return {
					registered: false,
					type: 0,
					email: 'adam@igital.co',
					authenticated: true,
					avatar:
						'https://lh6.googleusercontent.com/-_MUNJs5i5SU/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nBViBhs0JkjdffXGfuqHezcQapL8w/photo.jpg'
				};
			}

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
