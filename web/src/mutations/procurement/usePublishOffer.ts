import axios from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OfferId } from '../../models/Tender';

// Note that this interface is the true response from the API.
// Due to the flow of the client I need to refetch the offer after publishing it.
// it meant making some changes to leverage the onSuccess callback.
// interface PublishOfferResponse {
// 	errorText: 'OK';
// }

export const usePublishOffer = () => {
	const client = useQueryClient();

	return useMutation<OfferId, ErrorResponse, OfferId>(
		async (offerId) => {
			await axios.post(ApiService.publishOffer, offerId, { withCredentials: true });
			return offerId;
		},
		{
			onSuccess: async (variables) => {
				await client.refetchQueries(ApiService.offer(variables.offerId));
			}
		}
	);
};
