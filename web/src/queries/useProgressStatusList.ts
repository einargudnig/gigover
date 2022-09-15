import { ProgressStatus } from '../models/ProgressStatus';
import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

export interface ProgressStatusResponse {
	progressStatusList: ProgressStatus[];
}

export const useProgressStatusList = () =>
	useQuery<ProgressStatusResponse, ErrorResponse>(ApiService.getProgressStatusList, {
		refetchOnWindowFocus: false,
		retry: 1,
		initialData: {
			progressStatusList: []
		}
	});
