import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { IUserProfile } from '../models/UserProfile';
import { ErrorResponse } from '../models/ErrorResponse';

export const useVerifyDevWorker = () =>
	useMutation<IUserProfile, ErrorResponse>(
		async () => await axios.get(ApiService.debugVerifyContractor, { withCredentials: true })
	);

export const useVerify = () =>
	useMutation<IUserProfile, ErrorResponse, { token: string }>(
		async (variables) =>
			await axios.post(ApiService.verify, variables, {
				withCredentials: true
			})
	);
