import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';

export const useLogout = () => {
	return useMutation({
		mutationKey: ['Logout'],
		mutationFn: async () => {
			return await axios.get(ApiService.logout, { withCredentials: true });
		}
	});
};
