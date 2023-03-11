import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { ErrorResponse } from '../models/ErrorResponse';

export interface TenderOffer {
	tenderId: number;
	note: string;
}

// This is for to add the "whole" offer.
// There needs to be an offer so that we can add the offer items.
export const useAddOffers = () => {
	// const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, TenderOffer>(async (offer) => {
		try {
			const response = await axios.post(ApiService.addOffer, offer, {
				withCredentials: true
			});

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add offers');
		}
	});
};
