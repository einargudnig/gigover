import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Resource } from '../models/Resource';

interface ReleaseResourceResponse {
	errorText: 'OK';
}

export const useReleaseResource = () => {
	const queryClient = useQueryClient();

	return useMutation<ReleaseResourceResponse, ErrorResponse, Resource>(
		async (resource) =>
			await axios.post(ApiService.releaseResource, resource, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.resources);
			}
		}
	);
};
