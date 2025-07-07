import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { TenderDocumentByTenderOwner } from '../../models/TenderDocument'; //? Maybe I need to update this?
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface DocumentInput
	extends Pick<TenderDocumentByTenderOwner, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddTenderDocumentByTenderOwner = () => {
	const client = useQueryClient();

	return useMutation<{ tenderDocument: TenderDocumentByTenderOwner }, AxiosError, DocumentInput>({
		mutationKey: ['addTenderDocumentByTenderOwner'],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<{ tenderDocument: TenderDocumentByTenderOwner }>(
					ApiService.addTenderDocumentByTenderOwner,
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
		onSuccess: async (data, variables) => {
			await client.refetchQueries({
				queryKey: [ApiService.getTenderById(variables.tenderId)]
			});
		}
	});
};
