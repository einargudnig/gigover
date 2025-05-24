import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { Timesheet } from './useTrackerReport';

interface TimesheetWithWorkerId extends Omit<Timesheet, 'minutes' | 'workId'> {
	workerUId: string;
}

export const useWorkAdd = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, AxiosError, TimesheetWithWorkerId>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.workAdd, variables, {
				withCredentials: true
			});
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.report] });
		}
	});
};
