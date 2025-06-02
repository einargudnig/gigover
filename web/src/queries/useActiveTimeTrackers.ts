import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { TrackerReportItem } from './useTrackerReport';

interface ActiveTimeTrackersInput {
	from?: number;
	to?: number;
	projectId?: number;
}

// This interface describes the raw response from the API
interface ActiveTimeTrackersApiResponse {
	workers: TrackerReportItem[];
}

// This interface describes the data structure the mutation will resolve to
interface ActiveWorkersPayload {
	workers: TrackerReportItem[];
}

export const useActiveTimeTrackers = () =>
	useMutation<ActiveWorkersPayload, Error, ActiveTimeTrackersInput>({
		mutationFn: async (variables: ActiveTimeTrackersInput) => {
			const response = await axios.post<ActiveTimeTrackersApiResponse>(
				ApiService.activeWorkers,
				variables,
				{ withCredentials: true }
			);
			return response.data;
		}
	});
