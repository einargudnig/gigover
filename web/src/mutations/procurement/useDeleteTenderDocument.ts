import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

// export interface DocumentInput extends Pick<TenderDocumentByTenderOwner, 'tenderId' | 'name' | 'type' | 'url' | 'bytes'> { }

interface DeleteTenderDocumentVariables {
	id: number;
	tenderId: number;
	offerId: number;
}

export const useDeleteTenderDocument = () => {
	const client = useQueryClient();

	return useMutation({
		mutationFn: async (variables: DeleteTenderDocumentVariables) => {
			try {
				console.log('variable in mutation: ', variables);
				const response = await axios.post(
					ApiService.removeTenderDocumentByTenderOwner(variables.id),
					variables,
					{
						withCredentials: true
					}
				);

				await client.refetchQueries({
					queryKey: [
						ApiService.getTenderById(variables.tenderId),
						ApiService.offer(variables.offerId)
					]
				});

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not delete document`');
			}
		}
	});
};
