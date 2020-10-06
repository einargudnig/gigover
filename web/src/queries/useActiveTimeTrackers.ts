import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface ActiveTimeTrackersInput {
	from?: number;
	to?: number;
	projectId?: number;
}

interface ActiveTimeTrackersResponse {
	data: unknown;
}

export const useActiveTimeTrackers = () =>
	useMutation<ActiveTimeTrackersResponse, ErrorResponse, ActiveTimeTrackersInput>(
		async (variables) =>
			await axios.post(ApiService.activeWorkers, variables, { withCredentials: true })
	);
