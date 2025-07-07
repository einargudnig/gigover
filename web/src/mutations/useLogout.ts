import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';

export const useLogout = () => {
	return useMutation<AxiosResponse, AxiosError, void>({
		mutationKey: ['Logout'],
		mutationFn: async () => {
			return await axios.get(ApiService.logout, { withCredentials: true });
		}
	});
};
