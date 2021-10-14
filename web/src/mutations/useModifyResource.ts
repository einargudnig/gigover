import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Resource } from '../models/Resource';

interface ModifyResourceResponse {
	errorText: 'OK';
}

interface ResourceVariables extends Resource {}

export const useModifyResource = () => {
	const queryClient = useQueryClient();

	return useMutation<ModifyResourceResponse, ErrorResponse, ResourceVariables>(
		async (resource) =>
			await axios.post(
				resource?.id ? ApiService.editResource : ApiService.addResource,
				resource,
				{ withCredentials: true }
			),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.resources);
			}
		}
	);
};
