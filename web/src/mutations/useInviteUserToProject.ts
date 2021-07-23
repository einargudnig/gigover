import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import axios, { AxiosError } from 'axios';
import { devError } from '../utils/ConsoleUtils';
import { ErrorResponse } from '../models/ErrorResponse';

interface InviteUserInput {
	projectId: number;
	uId: string;
}

export const useInviteUserToProject = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.addUser;

	return useMutation<ErrorResponse, AxiosError, InviteUserInput>(
		mutationKey,
		async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				queryClient.refetchQueries(ApiService.projectDetails(variables.projectId));

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
