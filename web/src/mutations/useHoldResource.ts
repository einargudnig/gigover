import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ApiService } from '../services/ApiService';

export function useHoldResource() {
	const queryClient = useQueryClient();
	return useMutation<Resource, AxiosError<ErrorResponse>, Resource>({
		mutationFn: async (resource: Resource) => {
			const response = await axios.post(ApiService.holdResource, resource, {
				withCredentials: true
			});
			return response.data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: [ApiService.resources] });
			queryClient.invalidateQueries({
				queryKey: [ApiService.resourceHistory(variables.id!)]
			});
		}
	});
}
