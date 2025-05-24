import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';

export interface TimeTrackerInput {
	projectId: number;
	taskId: number;
	uId: string;
}

export const useTrackerStart = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, AxiosError, TimeTrackerInput>({
		mutationFn: async (variables: TimeTrackerInput) => {
			const response = await axios.post(ApiService.startTimer, variables, {
				withCredentials: true
			});
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.activeWorkers] });
			await queryClient.refetchQueries({ queryKey: [ApiService.timerReport] });
		}
	});
};
