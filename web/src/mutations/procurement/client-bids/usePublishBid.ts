import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { ApiService } from '../../../services/ApiService';

interface PublishBidResponse {
	errorText: 'OK';
}

interface PublishBidRequest {
	bidId: number;
}

export const usePublishBid = () => {
	const client = useQueryClient();

	return useMutation<PublishBidResponse, ErrorResponse, PublishBidRequest>({
		mutationKey: ['publishBid'],
		mutationFn: async (bidId: PublishBidRequest) => {
			try {
				const response = await axios.post(ApiService.publishBid, bidId, {
					withCredentials: true
				});

				if (response.status === 200) {
					console.log({ bidId });
					await client.refetchQueries({ queryKey: [ApiService.getBidById(bidId.bidId)] });
					await client.refetchQueries({ queryKey: [ApiService.getClientBids] });
				}
				return response.data;
			} catch (e) {
				throw new Error('Could not publish tender');
			}
		}
	});
};
