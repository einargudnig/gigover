import { useMutation, useQueryCache } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface AddWorkerInput {
	projectId: number;
	phoneNr: string;
}

export const useAddWorker = () => {
	const queryCache = useQueryCache();

	return useMutation<unknown, ErrorResponse, AddWorkerInput>(
		async (variables) =>
			await axios.post(ApiService.addWorker, variables, {
				withCredentials: true
			}),
		{
			onSuccess: async (data, variables) => {
				await queryCache.invalidateQueries(ApiService.projectDetails(variables.projectId));
			}
		}
	);
};
