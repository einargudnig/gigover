import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { PropertyDocument } from '../../models/Property';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface DocumentResponse {
	errorText: 'OK';
}

export const useRemovePropertyDocument = () => {
	const client = useQueryClient();

	return useMutation<DocumentResponse, AxiosError, PropertyDocument>({
		mutationFn: async (variables) => {
			console.log('VARIABLES I NMUTATION', variables);
			try {
				const response = await axios.post(
					ApiService.removePropertyDocument(variables.id),
					variables,
					{
						withCredentials: true
					}
				);
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (_data, variables) => {
			await client.invalidateQueries({
				queryKey: [ApiService.getPropertyById(variables.propertyId)]
			});
		}
	});
};
