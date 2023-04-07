import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { OfferId } from '../models/Tender';

interface PublishOfferResponse {
	errorText: 'OK';
}

export const usePublishOffer = () => {
	const client = useQueryClient();

	return useMutation<PublishOfferResponse, ErrorResponse, OfferId>(
		async (offerId) =>
			await axios.post(ApiService.publishOffer, offerId, { withCredentials: true }),
		{
			onSuccess: async () => {
				await client.refetchQueries(ApiService.publishOffer);
			}
		}
	);
};
