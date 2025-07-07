import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProgressStatus } from '../models/ProgressStatus';
import { ApiService } from '../services/ApiService';

export interface ProgressStatusResponse {
	progressStatusList: ProgressStatus[];
}

export const useProgressStatusList = () =>
	useQuery<ProgressStatusResponse, ErrorResponse>({
		queryKey: [ApiService.getProgressStatusList],
		queryFn: async () => {
			const response = await axios.get(ApiService.getProgressStatusList, {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: false,
		retry: 1,
		initialData: {
			progressStatusList: []
		}
	});
