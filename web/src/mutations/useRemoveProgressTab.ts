import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProgressStatus } from '../models/ProgressStatus';
import { ApiService } from '../services/ApiService';

export const useRemoveProgressTab = () => {
	const queryClient = useQueryClient();

	return useMutation<void, ErrorResponse, ProgressStatus>({
		mutationFn: async (progressStatus: ProgressStatus) => {
			const response = await axios.post(
				ApiService.removeProgressTab(progressStatus.id),
				{},
				{
					withCredentials: true
				}
			);
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: [ApiService.getProgressStatusList] });
		}
	});
};
