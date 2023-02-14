import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { TenderItem } from '../models/Tender';

// Types
export interface TenderItemResponse
	extends Pick<
		TenderItem,
		'tenderId' | 'tenderItemId' | 'nr' | 'description' | 'volume' | 'unit'
	> {}

export const useModifyTenderItem = () => {
	const { tenderId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, TenderItemResponse>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editTenderItem, variables, {
				withCredentials: true
			});

			if (response.status === 200) {
				await queryClient.refetchQueries(ApiService.getTenderById(Number(tenderId)));
			}
			return response.data;
		} catch (e) {
			throw new Error('Could not modify tender item');
		}
	});
};
