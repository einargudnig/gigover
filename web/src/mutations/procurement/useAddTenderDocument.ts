import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { TenderDocument } from '../../models/TenderDocument';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface DocumentInput
	extends Pick<TenderDocument, 'offerId' | 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddTenderDocument = () => {
	const client = useQueryClient();

	return useMutation<{ tenderDocument: TenderDocument }, AxiosError, DocumentInput>({
		mutationKey: ['addTenderDocument'],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<{ tenderDocument: TenderDocument }>(
					ApiService.addTenderDocument,
					variables,
					{
						withCredentials: true
					}
				);
				console.log('Document upload successful, response:', response.data);
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (data, variables) => {
			if (variables.offerId) {
				await client.refetchQueries({ queryKey: [ApiService.offer(variables.offerId)] });
			}
			// Potentially also refetch tender documents if variables.tenderId exists
			if (variables.tenderId) {
				await client.refetchQueries({
					queryKey: [ApiService.tenderDocuments(variables.tenderId)]
				});
			}
		}
	});
};
