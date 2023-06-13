import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { OfferId } from '../models/Tender';

export const useRejectOffer = () => {
	const client = useQueryClient();

	return useMutation<OfferId, ErrorResponse, OfferId>(
		async (offerId) => {
			await axios.post(ApiService.rejectOffer, offerId, { withCredentials: true });
			return offerId;
		},
		{
			onSuccess: async (variables) => {
				await client.refetchQueries(ApiService.offer(variables.offerId));
			}
		}
	);
};
