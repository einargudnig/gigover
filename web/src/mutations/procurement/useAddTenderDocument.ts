import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { TenderDocument } from '../../models/TenderDocument';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface DocumentInput
	extends Pick<TenderDocument, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> {}

export const useAddTenderDocument = () => {
	const client = useQueryClient();

	return useMutation<{ tenderDocument: TenderDocument }, AxiosError, DocumentInput>(
		async (variables) => {
			console.log('variables', variables);
			try {
				const response = await axios.post<{ tenderDocument: TenderDocument }>(
					ApiService.addTenderDocument,
					variables
					// {
					// 	withCredentials: true
					// }
				);

				await client.refetchQueries([ApiService.getTenderById(variables.tenderId)]);
				console.log('Document upload successful, response:', response.data);

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not upload document');
			}
		}
	);
};
