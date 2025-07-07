import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface RemoveWorkerInput {
	projectId: number;
	uId: string;
}

export const useRemoveWorker = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, ErrorResponse, RemoveWorkerInput>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.removeWorker, variables, {
				withCredentials: true
			});
			return response.data;
		},

		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: [ApiService.projectDetails(variables.projectId)]
			});
		}
	});
};
