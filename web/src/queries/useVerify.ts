import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { IUserProfile } from '../models/UserProfile';
import { ApiService } from '../services/ApiService';

interface MutationResponse {
	data: IUserProfile;
}

export const useVerify = () =>
	useMutation<MutationResponse, ErrorResponse, string>({
		mutationFn: async (token) => {
			const response = await axios.post<MutationResponse>(
				ApiService.verify,
				{ token },
				{
					withCredentials: true
				}
			);
			return response.data;
		}
	});
