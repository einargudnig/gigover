import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { BidId } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export const useRejectBid = () => {
	const client = useQueryClient();

	return useMutation<BidId, ErrorResponse, BidId>({
		mutationFn: async (bidId) => {
			const response = await axios.post(ApiService.rejectBid, bidId, {
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
