import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';

export interface TimeTrackerInput {
	projectId: number;
	taskId: number;
	uId: string;
}

export const useTrackerStart = () => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, AxiosError, TimeTrackerInput>(
		async (variables) =>
			await axios.post(ApiService.startTimer, variables, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
