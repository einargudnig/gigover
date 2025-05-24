import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ApiService } from '../services/ApiService';

interface ReleaseResourceResponse {
	errorText: 'OK';
}

export const useReleaseResource = () => {
	const queryClient = useQueryClient();

	return useMutation<ReleaseResourceResponse, ErrorResponse, Resource>({
		mutationFn: async (resource) => {
			const response = await axios.post(ApiService.releaseResource, resource, {
				withCredentials: true
			});
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.resources] });
		}
	});
};
