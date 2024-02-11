import { useMutation } from 'react-query';
import { ClientBidItems } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { ApiService } from '../../../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useQueryClient } from 'react-query';

export const useAddClientBidItem = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, ClientBidItems>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addClientBidItem, variables, {
				withCredentials: true
			});
			// If I successfully added a tender item, I need to refetch the tenderItems
			// So that the new tender item is displayed in the list.
			// I need to refetch the getTenderById query, since that is the one that fetches the tenderItems
			const clientBidId = variables?.clientBidId || 0;
			if (response.status === 200) {
				await queryClient.refetchQueries(ApiService.getClientBidsById(clientBidId));
			}

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
