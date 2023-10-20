import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';

interface BidderRejectResponse {
	errorText: 'OK';
}

interface BidderRejectRequest {
	tenderId: number;
}

export const useBidderReject = () => {
	const client = useQueryClient();

	return useMutation<BidderRejectResponse, ErrorResponse, BidderRejectRequest>(
		async (tenderId) => {
			try {
				const response = await axios.post(ApiService.rejectOffer, tenderId, {
					withCredentials: true
				});
				if (response.status === 200) {
					await client.refetchQueries(ApiService.getTenderById(tenderId.tenderId));
					await client.refetchQueries(ApiService.userTenders);
					await client.refetchQueries(ApiService.bidderTenders);
				}
				return response.data;
			} catch (e) {
				throw new Error('Could not reject offer');
			}
		}
	);
};
