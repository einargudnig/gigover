import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Resource } from '../models/Resource';

interface HoldResourceResponse {
	errorText: 'OK';
}

export const useHoldResource = () => {
	const queryClient = useQueryClient();

	return useMutation<HoldResourceResponse, ErrorResponse, Resource>(
		async (resource) =>
			await axios.post(ApiService.holdResource, resource, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.resources);
			}
		}
	);
};
