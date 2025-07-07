import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse, ErrorTypes } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface ModifyTimeRecordInput {
	workId: number;
	projectId: number;
	taskId: number;
	start: number;
	stop: number;
	comment: string;
}

export const useModifyTimeRecord = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, Error, ModifyTimeRecordInput>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.workChange, variables, {
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
