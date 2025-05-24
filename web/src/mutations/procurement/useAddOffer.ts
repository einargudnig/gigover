import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface TenderOffer {
	tenderId: number;
	notes: string;
}

export const useAddOffer = () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	return useMutation<{ id: number }, AxiosError, TenderOffer>({
		mutationFn: async (offer) => {
			try {
				const response = await axios.post<{ id: number }>(ApiService.addOffer, offer, {
					withCredentials: true
				});
				// Optional: Add check for response.data.id === 0 if critical
				// if (response.data.id === 0) {
				//     throw new Error('Failed to add offer, received id 0');
				// }
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		}
	});
};
