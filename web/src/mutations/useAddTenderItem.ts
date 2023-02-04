import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';

export interface TenderItems {
	tenderItemId: number;
	number: number;
	description: string;
	volume: number;
	unit: string;
}

// I get a 200 response when POSTing tenderItems.
// Now I need to check if it increases.
export const useAddTenderItem = () => {
	return useMutation<ErrorResponse, AxiosError, TenderItems>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addTenderItem, variables, {
				withCredentials: true
			});
			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
