import { useMutation, useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface ActiveTimeTrackersResponse {
	data: any;
}

export const useActiveTimeTrackers = () =>
	useMutation(
		async (variables: object) =>
			await axios.post(ApiService.activeWorkers, variables, { withCredentials: true })
	);
