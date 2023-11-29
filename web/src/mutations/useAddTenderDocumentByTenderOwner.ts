import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { TenderDocumentByTenderOwner, TenderDocument } from '../models/TenderDocument'; //? Maybe I need to update this?

export interface DocumentInput
	// extends Pick<TenderDocumentByTenderOwner, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}
	extends Pick<TenderDocument, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddTenderDocumentByTenderOwner = () => {
	return useMutation<{ tenderDocument: TenderDocument }, AxiosError, DocumentInput>(
		async (variables) => {
			try {
				const response = await axios.post<{ tenderDocument: TenderDocument }>(
					ApiService.addTenderDocumentByTenderOwner,
					variables,
					{
						withCredentials: true
					}
				);

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not upload document');
			}
		}
	);
};
