import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ContractorType, WorkerType } from '../models/UserProfile';
import { ApiService } from '../services/ApiService';

interface MutationResponse {
	registered: boolean;
	type: ContractorType | WorkerType;
	email: string;
	authenticated: boolean;
	avatar: string;
	name: string;
	phoneNumber: string;
	userName?: string;
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
