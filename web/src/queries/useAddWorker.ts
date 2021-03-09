import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface AddWorkerInput {
	projectId: number;
	uId: string;
}

interface AddWorkerResponse {
	uid: string;
}

export const useAddWorker = () => {
	const queryClient = useQueryClient();

	return useMutation<AddWorkerResponse, ErrorResponse, AddWorkerInput>(
		async (variables) =>
			await axios.post(ApiService.addWorker, variables, {
				withCredentials: true
			}),
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(ApiService.projectDetails(variables.projectId));
			}
		}
	);
};
