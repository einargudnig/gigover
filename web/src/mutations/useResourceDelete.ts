import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ApiService } from '../services/ApiService';

interface ResourceDeleteResponse {
	errorText: 'OK';
}

export const useResourceDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<ResourceDeleteResponse, ErrorResponse, Resource>({
		mutationFn: async (resource) => {
			const response = await axios.post(ApiService.deleteResource, resource, {
				withCredentials: true
			});
			return response.data;
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.resources] });
		}
	});
};
