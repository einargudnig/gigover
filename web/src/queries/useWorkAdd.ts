import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';
import { Timesheet } from './useTrackerReport';

interface TimesheetWithWorkerId extends Omit<Timesheet, 'minutes' | 'workId'> {
	workerUId: string;
}

export const useWorkAdd = () => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, AxiosError, TimesheetWithWorkerId>(
		async (variables) =>
			await axios.post(ApiService.workAdd, variables, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.report);
			}
		}
	);
};
