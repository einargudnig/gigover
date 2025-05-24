import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';

export interface TenderItemsOffer {
	itemId: number;
	offerId: number;
	productNumber?: string;
	cost?: number;
	note?: string;
}

//! what I need to pass to the server here:
// offerId: number; -> comes from the 'Open Offer'

export const useAddOfferItems = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, AxiosError, TenderItemsOffer>({
		mutationKey: ['addOfferItems'],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.addOfferItem, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				// Consider re-throwing e directly if AxiosError is expected
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not add offer item'); // Fallback
			}
		},
		onSuccess: async (data, variables) => {
			// Do I need to refetch any queries after I add a new offer to an item?
			await queryClient.refetchQueries({ queryKey: [ApiService.offer(variables.offerId)] });
		}
	});
};
