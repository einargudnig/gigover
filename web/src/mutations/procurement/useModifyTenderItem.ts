import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { TenderItem } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

// Types
export interface TenderItemResponse
	extends Pick<
		TenderItem,
		'tenderId' | 'tenderItemId' | 'nr' | 'description' | 'volume' | 'unit'
	> {}

export const useModifyTenderItem = () => {
	const { tenderId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<TenderItemResponse, AxiosError, TenderItemResponse>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.editTenderItem, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not modify tender item');
			}
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: [ApiService.getTenderById(Number(tenderId))]
			});
		}
	});
};
