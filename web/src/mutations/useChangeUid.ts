import { useMutation } from 'react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';

export const useChangeUid = () => {
	return useMutation('ChangeUID', async (uid: string) => {
		return await axios.post(ApiService.change, { uId: uid }, { withCredentials: true });
	});
};
