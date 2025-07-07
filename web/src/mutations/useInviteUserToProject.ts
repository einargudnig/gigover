import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

interface InviteUserInput {
	projectId: number;
	uId: string;
}

export const useInviteUserToProject = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, Error, InviteUserInput>({
		mutationKey: [ApiService.addUser],

		mutationFn: async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(ApiService.addUser, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorText || response.data?.errorCode);
				}

				await queryClient.refetchQueries({
					queryKey: [ApiService.projectDetails(variables.projectId)]
				});

				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	});
};
