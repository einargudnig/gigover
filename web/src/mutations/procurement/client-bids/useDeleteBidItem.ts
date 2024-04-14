import { useMutation } from 'react-query';
import { BidItem } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useQueryClient } from 'react-query';

interface ClientBidItemDeleteResponse {
	errorText: 'OK';
}

export const useDeleteBidItem = () => {
	const queryClient = useQueryClient();

	return useMutation<ClientBidItemDeleteResponse, AxiosError, BidItem>(async (variables) => {
		try {
			const response = await axios.post(ApiService.deleteBidItem, variables, {
				withCredentials: true
			});
			// If I successfully added a tender item, I need to refetch the tenderItems
			// So that the new tender item is displayed in the list.
			// I need to refetch the getTenderById query, since that is the one that fetches the tenderItems
			const bidId = variables?.bidId || 0;
			if (response.status === 200) {
				await queryClient.refetchQueries(ApiService.getBidById(bidId));
			}

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
