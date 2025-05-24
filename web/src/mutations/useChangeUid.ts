import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';

export const useChangeUid = () => {
	return useMutation<unknown, AxiosError, string>({
		mutationFn: async (uid: string) => {
			const response = await axios.post(
				ApiService.change,
				{ uId: uid },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};
