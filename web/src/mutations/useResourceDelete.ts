import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Resource } from '../models/Resource';

interface ResourceDeleteResponse {
	errorText: 'OK';
}

export const useResourceDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<ResourceDeleteResponse, ErrorResponse, Resource>(
		async (resource) =>
			await axios.post(ApiService.deleteResource, resource, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.resources);
			}
		}
	);
};
