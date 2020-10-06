import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';
import { TrackerReportItem } from './useTrackerReport';

interface ActiveTimeTrackersInput {
	from?: number;
	to?: number;
	projectId?: number;
}

interface ActiveTimeTrackersResponse {
	data: {
		workers: TrackerReportItem[];
	};
}

export const useActiveTimeTrackers = () =>
	useMutation<ActiveTimeTrackersResponse, ErrorResponse, ActiveTimeTrackersInput>(
		async (variables) =>
			await axios.post(ApiService.activeWorkers, variables, { withCredentials: true })
	);
