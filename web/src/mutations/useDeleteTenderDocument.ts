import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import { devError } from '../utils/ConsoleUtils';
import { ApiService } from '../services/ApiService';
import { TenderDocumentByTenderOwner } from '../models/TenderDocument';

export interface DocumentInput
	extends Pick<TenderDocumentByTenderOwner, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useDeleteTenderDocument = () => {
	const client = useQueryClient();

	return useMutation<TenderDocumentByTenderOwner, AxiosError, DocumentInput>(
		async (variables) => {
			try {
				const response = await axios.post<TenderDocumentByTenderOwner>(
					ApiService.removeTenderDocumentByTenderOwner,
					variables,
					{
						withCredentials: true
					}
				);

				await client.invalidateQueries(ApiService.getTenderById(variables.tenderId));

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not upload image');
			}
		}
	);
};
