import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { IUserProfile } from '../models/UserProfile';
import { ErrorResponse } from '../models/ErrorResponse';

interface MutationResponse {
	data: IUserProfile;
}

export const useVerifyDevWorker = () =>
	useMutation<MutationResponse, ErrorResponse>(
		async () => await axios.get(ApiService.debugVerifyContractor, { withCredentials: true })
	);

export const useVerify = () =>
	useMutation<MutationResponse, ErrorResponse, string>(
		async (token) =>
			await axios.post(
				ApiService.verify,
				{ token },
				{
					withCredentials: true
				}
			)
	);
