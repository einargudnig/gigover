import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation } from 'react-query';
import { devError } from '../utils/ConsoleUtils';

export interface TenderOffer {
	tenderId: number;
	note: string;
}

export const useAddOffer = () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	return useMutation<AxiosResponse<{ id: number }>, AxiosError, TenderOffer>(async (offer) => {
		try {
			const response = await axios.post(ApiService.addOffer, offer, {
				withCredentials: true
			});
			// Let's comment this out for now.
			// Return the response, even though it is 0, then we can return an message to the user
			// if (response.data.id === 0) {
			// 	throw new Error('unable to add offer, received id 0');
			// }

			return response;
		} catch (e) {
			devError(e);
			throw new Error('Could not add offers');
		}
	});
};
