import axios from 'axios';
import { useMutation, useQueryCache } from 'react-query';
import { ApiService } from '../services/ApiService';

interface TrackerReportInput {
	projectId?: number;
	from?: number;
	to?: number;
}

export const useTrackerReport = () => {
	const queryCache = useQueryCache();

	return useMutation<any, any, TrackerReportInput>(
		async (variables = {}) =>
			await axios.post(ApiService.timerReport, variables, { withCredentials: true })
	);
};
