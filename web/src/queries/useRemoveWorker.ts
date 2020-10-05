import { useMutation, useQueryCache } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface RemoveWorkerInput {
	projectId: number;
	uId: string;
}

export const useRemoveWorker = () => {
	const queryCache = useQueryCache();

	return useMutation<unknown, ErrorResponse, RemoveWorkerInput>(
		async (variables) =>
			await axios.post(ApiService.removeWorker, variables, {
				withCredentials: true
			}),
		{
			onSuccess: async (data, variables) => {
				await queryCache.invalidateQueries(ApiService.projectDetails(variables.projectId));
			}
		}
	);
};
