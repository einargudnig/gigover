import { useMutation } from 'react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';

export const useLogout = () => {
	return useMutation('Logout', async () => {
		return await axios.get(ApiService.logout, { withCredentials: true });
	});
};
