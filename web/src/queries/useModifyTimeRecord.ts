import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios, { AxiosResponse } from 'axios';

interface ModifyTimeRecordInput {
	workId: number;
	minutes: number;
}

export const useModifyTimeRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse, ErrorResponse, ModifyTimeRecordInput>(
		async (variables) =>
			await axios.post(ApiService.changeTimeRecord, variables, {
				withCredentials: true
			}),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.timerReport);
				await queryClient.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
