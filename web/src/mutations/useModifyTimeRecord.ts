import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse, ErrorTypes } from '../models/ErrorResponse';
import axios, { AxiosResponse } from 'axios';

interface ModifyTimeRecordInput {
	workId: number;
	projectId: number;
	taskId: number;
	start: number;
	stop: number;
}

export const useModifyTimeRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, ErrorResponse, ModifyTimeRecordInput>(
		async (variables) => {
			const response = await axios.post(ApiService.workChange, variables, {
				withCredentials: true
			});

			if (response.data && response.data.errorCode !== ErrorTypes.OK) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.timerReport);
				await queryClient.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
