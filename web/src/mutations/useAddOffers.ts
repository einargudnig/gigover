import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { ErrorResponse } from '../models/ErrorResponse';

export const useAddOffers = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, number>(async (offer) => {
		try {
			const response = await axios.post(ApiService.addOffer, offer, {
				withCredentials: true
			});
			await client.refetchQueries(ApiService.addOffer);

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add offers');
		}
	});
};
