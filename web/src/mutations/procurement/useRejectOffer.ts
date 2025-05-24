import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OfferId } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export const useRejectOffer = () => {
	const client = useQueryClient();

	return useMutation<OfferId, ErrorResponse, OfferId>({
		mutationFn: async (offerId) => {
			const response = await axios.post(ApiService.rejectOffer, offerId, {
				withCredentials: true
			});
			return response.data; // Assuming response.data is compatible with OfferId
		},
		onSuccess: async (data, offerIdVariables) => {
			await client.refetchQueries({ queryKey: [ApiService.offer(offerIdVariables.offerId)] });
		}
	});
};
