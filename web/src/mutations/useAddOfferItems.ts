import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useQueryClient } from 'react-query';

export interface TenderItemsOffer {
	itemId: number;
	offerId: number;
	cost?: number;
	notes?: string;
}

//! what I need to pass to the server here:
// offerId: number; -> comes from the 'Open Offer'

export const useAddOfferItems = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, TenderItemsOffer>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addOfferItem, variables, {
				withCredentials: true
			});
			// Do I need to refetch any queries after I add a new offer to an item??
			// ! I might want to refetch the offers?
			await queryClient.refetchQueries(ApiService.offer(variables.offerId));

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
