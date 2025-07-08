import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { BidItem } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

interface ClientBidItemDeleteResponse {
	errorText: 'OK';
}

export const useDeleteBidItem = () => {
	const queryClient = useQueryClient();

	return useMutation<ClientBidItemDeleteResponse, AxiosError, BidItem>({
		mutationKey: ['deleteBidItem'],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.deleteBidItem, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not delete bid item'); // Fallback
			}
		},
		onSuccess: async (data, variables) => {
			const bidId = variables?.bidId || 0;
			// The original code checked data.errorText === 'OK' or response.status === 200.
			// onSuccess implies a successful HTTP status. We can check data.errorText if needed.
			if (data.errorText === 'OK') {
				await queryClient.invalidateQueries({ queryKey: [ApiService.getBidById(bidId)] });
			}
		}
	});
};
