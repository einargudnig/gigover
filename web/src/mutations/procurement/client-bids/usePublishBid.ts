import axios from 'axios';
import { ApiService } from '../../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';

interface PublishBidResponse {
	errorText: 'OK';
}

interface PublishBidRequest {
	bidId: number;
}

export const usePublishBid = () => {
	const client = useQueryClient();

	return useMutation<PublishBidResponse, ErrorResponse, PublishBidRequest>(async (bidId) => {
		try {
			const response = await axios.post(ApiService.publishBid, bidId, {
				withCredentials: true
			});

			if (response.status === 200) {
				console.log({ bidId });
				await client.refetchQueries(ApiService.getBidById(bidId.bidId));
				await client.refetchQueries(ApiService.getClientBids);
			}
			return response.data;
		} catch (e) {
			throw new Error('Could not publish tender');
		}
	});
};
