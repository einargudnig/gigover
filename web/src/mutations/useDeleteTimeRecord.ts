import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse, ErrorTypes } from '../models/ErrorResponse';
import { Timesheet } from '../queries/useTrackerReport';
import { ApiService } from '../services/ApiService';

export const useDeleteTimeRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, Error, Partial<Timesheet>>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.workRemove, variables, {
				withCredentials: true
			});

			if (response.data && response.data.errorCode !== ErrorTypes.OK) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.timerReport] });
			await queryClient.invalidateQueries({ queryKey: [ApiService.activeWorkers] });
		}
	});
};
