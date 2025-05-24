import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { PropertyToProject } from '../../models/Property';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface AddProjectToPropertyResponse {
	errorText: 'OK';
}

export const useRemoveProjectFromProperty = () => {
	const client = useQueryClient();

	return useMutation<AddProjectToPropertyResponse, AxiosError, PropertyToProject>({
		mutationFn: async (variables) => {
			try {
				// console.log('variable in mutation: ', variables);
				const response = await axios.post(
					ApiService.removeProject(variables.propertyId, variables.projectId),
					variables,
					{
						withCredentials: true
					}
				);
				console.log('response.data: ', response.data);
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (data, variables) => {
			await client.refetchQueries({
				queryKey: [ApiService.getPropertyById(variables.propertyId)]
			});
		}
	});
};
