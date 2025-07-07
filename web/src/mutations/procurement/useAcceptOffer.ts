import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OfferId } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export const useAcceptOffer = () => {
	const client = useQueryClient();

	return useMutation<OfferId, ErrorResponse, OfferId>({
		mutationKey: ['acceptOffer'],
		mutationFn: async (offerId) => {
			const response = await axios.post(ApiService.acceptOffer, offerId, {
				withCredentials: true
			});
			return response.data; // Assuming response.data is compatible with OfferId
		},
		onSuccess: async (data, offerIdVariables) => {
			// data is response.data, offerIdVariables is the input offerId
			// If ApiService.offer expects the offerId itself for the queryKey:
			await client.refetchQueries({ queryKey: [ApiService.offer(offerIdVariables.offerId)] });
		}
	});
};
