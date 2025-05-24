import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { BidId } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export const useAcceptBid = () => {
	const client = useQueryClient();

	return useMutation<BidId, ErrorResponse, BidId>({
		mutationKey: ['acceptBid'],
		mutationFn: async (bidId) => {
			const response = await axios.post(ApiService.acceptBid, bidId, {
				withCredentials: true
			});
			return response.data; // Assuming response.data is compatible with BidId
		},
		onSuccess: async (data, bidIdVariables) => {
			await client.refetchQueries({
				queryKey: [ApiService.getClientBidById(bidIdVariables.bidId)]
			});
		}
	});
};
