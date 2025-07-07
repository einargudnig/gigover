import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ApiService } from '../services/ApiService';

interface ModifyResourceResponse {
	errorText: 'OK';
}

export const useModifyResource = () => {
	const queryClient = useQueryClient();

	return useMutation<ModifyResourceResponse, ErrorResponse, Resource>({
		mutationFn: async (resource) => {
			const response = await axios.post(
				resource?.id ? ApiService.editResource : ApiService.addResource,
				resource,
				{ withCredentials: true }
			);
			return response.data;
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.resources] });
		}
	});
};
