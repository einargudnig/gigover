import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { TimeTrackerInput } from './useTrackerStart';

interface TimeTrackerInputWithComment extends TimeTrackerInput {
	comment: string | null;
}

export const useTrackerStop = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, AxiosError, TimeTrackerInputWithComment>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.stopTimer, variables, {
				withCredentials: true
			});
			return response.data;
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.activeWorkers] });
			await queryClient.invalidateQueries({ queryKey: [ApiService.activeWorkers] });
		}
	});
};
