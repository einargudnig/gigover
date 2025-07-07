import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';

interface BidderRejectResponse {
	errorText: 'OK';
}

interface BidderRejectRequest {
	tenderId: number;
}

export const useBidderReject = () => {
	const client = useQueryClient();

	return useMutation<BidderRejectResponse, ErrorResponse, BidderRejectRequest>({
		mutationKey: ['bidderReject'],
		mutationFn: async (tenderId: BidderRejectRequest) => {
			try {
				const response = await axios.post(ApiService.bidderReject, tenderId, {
					withCredentials: true
				});
				if (response.status === 200) {
					await client.refetchQueries({
						queryKey: [ApiService.getTenderById(tenderId.tenderId)]
					});
					await client.refetchQueries({ queryKey: [ApiService.userTenders] });
					await client.refetchQueries({ queryKey: [ApiService.bidderTenders] });
				}
				return response.data;
			} catch (e) {
				throw new Error('Could not reject offer');
			}
		}
	});
};
