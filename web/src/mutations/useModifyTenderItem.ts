import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios, { AxiosError } from 'axios';
import { TenderItem } from '../models/Tender';

// Types
export interface TenderData
	extends Pick<TenderItem, 'tenderItemId' | 'nr' | 'description' | 'volume' | 'unit'> {}

export const useModifyTenderItem = () => {
	const client = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, TenderData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editTenderItem, variables, {
				withCredentials: true
			});

			await client.refetchQueries(ApiService.editTenderItem); //? Shouldn't this be a get request on the tender item??

			return response.data;
		} catch (e) {
			throw new Error('Could not modify tender item');
		}
	});
};
