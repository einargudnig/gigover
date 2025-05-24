import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface AddWorkerInput {
	projectId: number;
	uId: string;
}

interface AddWorkerResponse {
	uid: string;
}

export const useAddWorker = () => {
	const queryClient = useQueryClient();

	return useMutation<AddWorkerResponse, ErrorResponse, AddWorkerInput>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.addWorker, variables, {
				withCredentials: true
			});
			return response.data; // Assuming the actual data is in response.data
		},

		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: [ApiService.projectDetails(variables.projectId)]
			});
		}
	});
};
