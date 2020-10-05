import { useMutation, useQueryCache } from 'react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { TimeTrackerInput } from './useTrackerStart';

export const useTrackerStop = () => {
	const queryCache = useQueryCache();

	return useMutation<any, any, TimeTrackerInput>(
		async (variables) =>
			await axios.post(ApiService.stopTimer, variables, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryCache.invalidateQueries(ApiService.activeWorkers);
			}
		}
	);
};
