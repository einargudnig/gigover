import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';

interface ActiveTimeTrackersResponse {
	data: any;
}

export const useActiveTimeTrackers = () =>
	useQuery<ActiveTimeTrackersResponse, ErrorResponse>(ApiService.activeWorkers);
