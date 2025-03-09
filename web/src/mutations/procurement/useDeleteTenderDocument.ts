import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { TenderDocumentByTenderOwner } from '../../models/TenderDocument';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

// export interface DocumentInput extends Pick<TenderDocumentByTenderOwner, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> { }

interface TenderDocumentDeleteResponse {
	errorText: 'OK';
}

export const useDeleteTenderDocument = () => {
	const client = useQueryClient();

	return useMutation<TenderDocumentDeleteResponse, AxiosError, TenderDocumentByTenderOwner>(
		async (variables) => {
			try {
				console.log('variable in mutation: ', variables);
				const response = await axios.post(
					ApiService.removeTenderDocumentByTenderOwner(variables.id),
					variables,
					{
						withCredentials: true
					}
				);

				await client.refetchQueries([
					ApiService.getTenderById(variables.tenderId),
					ApiService.offer(variables.offerId)
				]);

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not delete document`');
			}
		}
	);
};
