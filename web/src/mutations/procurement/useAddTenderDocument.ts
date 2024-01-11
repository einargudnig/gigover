import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { TenderDocument } from '../../models/TenderDocument';

export interface DocumentInput
	extends Pick<TenderDocument, 'offerId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddTenderDocument = () => {
	const client = useQueryClient();

	return useMutation<{ tenderDocument: TenderDocument }, AxiosError, DocumentInput>(
		async (variables) => {
			try {
				const response = await axios.post<{ tenderDocument: TenderDocument }>(
					ApiService.addTenderDocument,
					variables,
					{
						withCredentials: true
					}
				);
				await client.refetchQueries(ApiService.getTenderById(variables.offerId));

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not upload document');
			}
		}
	);
};
