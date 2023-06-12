import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProgressStatus } from '../models/ProgressStatus';
import axios from 'axios';

export const useRemoveProgressTab = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, ErrorResponse, ProgressStatus>(
		async (progressStatus: ProgressStatus) =>
			await axios.post(
				ApiService.removeProgressTab(progressStatus.id),
				{},
				{
					withCredentials: true
				}
			),
		{
			onSuccess: async () => {
				await queryClient.refetchQueries(ApiService.getProgressStatusList);
			}
		}
	);
};
