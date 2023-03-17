import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation } from 'react-query';
import { devError } from '../utils/ConsoleUtils';

export interface TenderOffer {
	tenderId: number;
	note: string;
}

// This is for to add the "whole" offer.
// There needs to be an offer so that we can add the offer items.
export const useAddOffer = () => {
	// const client = useQueryClient();

	// Should I try to get the offerId from the response?
	/* eslint-disable @typescript-eslint/no-explicit-any */
	return useMutation<AxiosResponse<{ id: number }>, AxiosError, TenderOffer>(async (offer) => {
		try {
			const response = await axios.post(ApiService.addOffer, offer, {
				withCredentials: true
			});
			return response;
		} catch (e) {
			devError(e);
			throw new Error('Could not add offers');
		}
	});
};
