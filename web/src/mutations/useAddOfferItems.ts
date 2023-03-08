import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { TenderItem } from '../models/Tender';

export interface TenderItemsOffer {
	tenderId: number;
	tenderItemId?: number;
	nr?: number;
	offerId: number;
	description?: string;
	volume?: number;
	unit?: string;
	cost: number;
	notes: string;
}

//! what I need to pass to the server here:
// offerId: number; -> comes from the 'Open Offer'

export const useAddOfferItems = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, TenderItem>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addOfferItem, variables, {
				withCredentials: true
			});
			// Do I need to refetch any queries after I add a new offer to an item??
			// ! I might want to refetch the offers?
			// const tenderId = variables?.tenderId || 0;
			// if (response.status === 200) {
			// 	await queryClient.refetchQueries(ApiService.getTenderById(tenderId));
			// }

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
