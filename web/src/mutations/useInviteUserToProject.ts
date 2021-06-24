import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import axios, { AxiosError } from 'axios';
import { devError } from '../utils/ConsoleUtils';
import { ErrorResponse } from '../models/ErrorResponse';

interface InviteUserInput {
	projectId: number;
	uId: string;
}

export const useInviteUserToProject = () => {
	return useMutation<ErrorResponse, AxiosError, InviteUserInput>(
		ApiService.addWorker,
		async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(ApiService.addWorker, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
