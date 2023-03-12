import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { Offer } from '../models/Tender';

interface PublishOfferResponse {
	errorText: 'OK';
}

export const usePublishOffer = () => {
	const client = useQueryClient();

	return useMutation<PublishOfferResponse, ErrorResponse, Offer>(
		async (offer) =>
			await axios.post(ApiService.publishOffer, offer, { withCredentials: true }),
		{
			onSuccess: async () => {
				await client.invalidateQueries(ApiService.publishOffer);
			}
		}
	);
};
