import { useMutation, useQueryCache } from 'react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';

export interface TimeTrackerInput {
	projectId: number;
	taskId: number;
	uId: string;
}

export const useTrackerStart = () => {
	const queryCache = useQueryCache();

	return useMutation<any, any, TimeTrackerInput>(
		async (variables) =>
			await axios.post(ApiService.startTimer, variables, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryCache.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
