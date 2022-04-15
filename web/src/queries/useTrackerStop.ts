import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';
import { TimeTrackerInput } from './useTrackerStart';

interface TimeTrackerInputWithComment extends TimeTrackerInput {
	comment: string | null;
}

export const useTrackerStop = () => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, AxiosError, TimeTrackerInputWithComment>(
		async (variables) =>
			await axios.post(ApiService.stopTimer, variables, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.activeWorkers);
				await queryClient.refetchQueries(ApiService.activeWorkers);
			}
		}
	);
};
