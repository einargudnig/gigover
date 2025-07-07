import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../../../services/ApiService';

export interface BidItems {
	bidId: number;
	bidItemId?: number;
	nr?: string;
	description?: string;
	volume?: number;
	unit?: string;
	cost?: number;
}

export const useAddBidItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['addBidItem'],
		mutationFn: async (variables: BidItems) => {
			console.log({ variables });
			try {
				const response = await axios.post(ApiService.addBidItem, variables, {
					withCredentials: true
				});
				// If I successfully added a tender item, I need to refetch the tenderItems
				// So that the new tender item is displayed in the list.
				// I need to refetch the getTenderById query, since that is the one that fetches the tenderItems
				const bidId = variables?.bidId || 0;
				if (response.status === 200) {
					await queryClient.refetchQueries({ queryKey: [ApiService.getBidById(bidId)] });
				}

				return response.data;
			} catch (e) {
				throw new Error('Could not add tender item');
			}
		}
	});
};
