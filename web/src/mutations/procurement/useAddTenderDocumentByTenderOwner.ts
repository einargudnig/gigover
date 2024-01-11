import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { TenderDocumentByTenderOwner } from '../../models/TenderDocument'; //? Maybe I need to update this?

export interface DocumentInput
	extends Pick<TenderDocumentByTenderOwner, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddTenderDocumentByTenderOwner = () => {
	const client = useQueryClient();

	return useMutation<{ tenderDocument: TenderDocumentByTenderOwner }, AxiosError, DocumentInput>(
		async (variables) => {
			try {
				const response = await axios.post<{ tenderDocument: TenderDocumentByTenderOwner }>(
					ApiService.addTenderDocumentByTenderOwner,
					variables,
					{
						withCredentials: true
					}
				);

				await client.refetchQueries(ApiService.getTenderById(variables.tenderId));

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not upload document');
			}
		}
	);
};
