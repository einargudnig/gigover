import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse, ErrorTypes } from '../models/ErrorResponse';
import axios, { AxiosResponse } from 'axios';
import { Timesheet } from '../queries/useTrackerReport';

export const useDeleteTimeRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, ErrorResponse, Timesheet>(
		async (variables) => {
			const response = await axios.post(ApiService.workRemove, variables, {
				withCredentials: true
			});

			if (response.data && response.data.errorCode !== ErrorTypes.OK) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},
		{
			onSuccess: async () => {
				// await queryClient.invalidateQueries(ApiService.timerReport);
				await queryClient.refetchQueries(ApiService.timerReport);
				await queryClient.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
