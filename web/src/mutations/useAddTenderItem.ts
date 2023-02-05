import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import axios from 'axios';
import { useQueryClient } from 'react-query';

export interface TenderItems {
	tenderId: number;
	tenderItemId?: number;
	nr: number;
	description: string;
	volume: number;
	unit: string;
}

// can I use the onSuccess to trigger a refetch of the tender?
export const useAddTenderItem = () => {
	const client = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, TenderItems>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addTenderItem, variables, {
				withCredentials: true
			});

			if (response.status === 200) {
				console.log('I need to refetch the tenderItems, since I added a new one');
				await client.refetchQueries(ApiService.getTenderById(variables.tenderId));
			}

			return response.data;
		} catch (e) {
			throw new Error('Could not add tender item');
		}
	});
};
