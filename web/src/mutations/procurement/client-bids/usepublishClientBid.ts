import axios from 'axios';
import { ApiService } from '../../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';

interface PublishClientBidResponse {
	errorText: 'OK';
}

interface PublishClientBidRequest {
	clientBidId: number;
}

export const usePublishClientBid = () => {
	const client = useQueryClient();

	return useMutation<PublishClientBidResponse, ErrorResponse, PublishClientBidRequest>(
		async (clientBidId) => {
			try {
				const response = await axios.post(ApiService.publishTender, clientBidId, {
					withCredentials: true
				});

				if (response.status === 200) {
					await client.refetchQueries(ApiService.getTenderById(clientBidId.clientBidId));
					// await client.refetchQueries(ApiService.userTenders);
				}
				return response.data;
			} catch (e) {
				throw new Error('Could not publish tender');
			}
		}
	);
};
