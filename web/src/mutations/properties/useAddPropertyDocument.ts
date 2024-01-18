import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { PropertyDocument } from '../../models/Property';

export interface DocumentInput
	extends Pick<PropertyDocument, 'propertyId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddPropertyDocument = () => {
	const client = useQueryClient();

	return useMutation<{ propertyDocument: PropertyDocument }, AxiosError, DocumentInput>(
		async (variables) => {
			try {
				const response = await axios.post<{ propertyDocument: PropertyDocument }>(
					ApiService.addPropertyDocument,
					variables,
					{
						withCredentials: true
					}
				);

				await client.refetchQueries(ApiService.getPropertyById(variables.propertyId));

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not upload document');
			}
		}
	);
};
