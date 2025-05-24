import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { PropertyDocument } from '../../models/Property';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface DocumentInput
	extends Pick<PropertyDocument, 'propertyId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddPropertyDocument = () => {
	const client = useQueryClient();

	return useMutation<{ propertyDocument: PropertyDocument }, AxiosError, DocumentInput>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<{ propertyDocument: PropertyDocument }>(
					ApiService.addPropertyDocument,
					variables,
					{
						withCredentials: true
					}
				);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		},
		onSuccess: (data, variables) => {
			client.refetchQueries({ queryKey: [ApiService.getPropertyById(variables.propertyId)] });
		}
	});
};
