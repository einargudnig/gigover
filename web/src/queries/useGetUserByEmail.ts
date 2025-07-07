import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

interface UserIdByEmail {
	uId: string;
}

interface UserIdByEmailVariables {
	email: string;
}

export const useGetUserByEmail = () =>
	useMutation<UserIdByEmail, Error, UserIdByEmailVariables>({
		mutationFn: async (variables: UserIdByEmailVariables) => {
			try {
				const response = await axios.post<UserIdByEmail>(
					ApiService.getUserIdByEmail,
					variables,
					{
						withCredentials: false
					}
				);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	});
