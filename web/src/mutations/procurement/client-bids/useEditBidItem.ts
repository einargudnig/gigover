import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { BidItem } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export interface BidItemResponse
	extends Pick<
		BidItem,
		'bidId' | 'bidItemId' | 'nr' | 'description' | 'volume' | 'unit' | 'cost'
	> {}

export const useEditBidItem = () => {
	const { bidId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<BidItemResponse, AxiosError, BidItemResponse>({
		mutationKey: ['editBidItem'],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.editBidItem, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				if (e instanceof Error) {
					throw e;
				}
				throw new Error('Could not edit bid item');
			}
		},
		onSuccess: async (_data, _variables) => {
			await queryClient.refetchQueries({ queryKey: [ApiService.getBidById(Number(bidId))] });
		}
	});
};
