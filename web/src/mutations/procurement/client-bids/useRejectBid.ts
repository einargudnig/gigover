import axios from 'axios';
import { ApiService } from '../../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { BidId } from '../../../models/Tender';

export const useRejectBid = () => {
	const client = useQueryClient();

	return useMutation<BidId, ErrorResponse, BidId>(
		async (bidId) => {
			await axios.post(ApiService.rejectBid, bidId, { withCredentials: true });
			return bidId;
		},
		{
			onSuccess: async (variables) => {
				await client.refetchQueries(ApiService.getBidById(variables.bidId));
			}
		}
	);
};
