import { useMutation, useQueryCache } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface ModifyTimeRecordInput {
	workId: number;
	minutes: number;
}

export const useModifyTimeRecord = () => {
	const queryCache = useQueryCache();

	return useMutation<unknown, ErrorResponse, ModifyTimeRecordInput>(
		async (variables) =>
			await axios.post(ApiService.changeTimeRecord, variables, {
				withCredentials: true
			}),
		{
			onSuccess: async () => {
				await queryCache.invalidateQueries(ApiService.timerReport);
				await queryCache.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
