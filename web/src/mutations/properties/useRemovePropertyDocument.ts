import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { PropertyDocument } from '../../models/Property';

interface DocumentResponse {
	errorText: 'OK';
}

export const useRemovePropertyDocument = () => {
	const client = useQueryClient();

	return useMutation<DocumentResponse, AxiosError, PropertyDocument>(async (variables) => {
		try {
			const response = await axios.post(
				ApiService.removePropertyDocument(variables.id),
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
	});
};
