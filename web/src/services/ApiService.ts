import { IUserProfile } from '../models/UserProfile';
import axios from 'axios';

export const API_BASE = 'https://gigover2.appspot.com/rest/';

export class ApiService {
	static verify = API_BASE + 'user/verify';
	static projectList = API_BASE + 'contractor/list/';
	static projectDetails = (id: number): string => API_BASE + 'contractor/project/' + id;
	static createProject = API_BASE + 'contractor/store';
	static registerUser = API_BASE + 'user/store';

	static checkAuthToken = async (token: string): Promise<IUserProfile | null> => {
		try {
			const response = await axios.post(
				ApiService.verify,
				{
					token
				},
				{
					withCredentials: true
				}
			);

			if (response.status === 200) {
				console.log(response.headers['set-cookie']);
				return response.data as IUserProfile;
			}

			return null;
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			throw new Error(e.toString());
		}
	};

	static getProjectList = async (): Promise<unknown | null> => {
		try {
			const response = await axios.get(ApiService.projectList, {
				withCredentials: true
			});

			if (response.status === 200) {
				return response.data;
			}

			return null;
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			throw new Error(e.toString());
		}
	};
}
