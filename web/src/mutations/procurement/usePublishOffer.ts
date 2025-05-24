import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OfferId } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

// Note that this interface is the true response from the API.
// Due to the flow of the client I need to refetch the offer after publishing it.
// it meant making some changes to leverage the onSuccess callback.
// interface PublishOfferResponse {
// 	errorText: 'OK';
// }

export const usePublishOffer = () => {
	const client = useQueryClient();

	return useMutation<OfferId, ErrorResponse, OfferId>({
		mutationFn: async (offerId) => {
			const response = await axios.post(ApiService.publishOffer, offerId, {
				withCredentials: true
			});
			return response.data; // Assuming response.data is compatible with OfferId
		},
		onSuccess: async (data, offerIdVariables) => {
			// data is response.data, offerIdVariables is the input offerId
			await client.refetchQueries({ queryKey: [ApiService.userOffers] });
			await client.refetchQueries({ queryKey: [ApiService.offer(offerIdVariables.offerId)] });
		}
	});
};
