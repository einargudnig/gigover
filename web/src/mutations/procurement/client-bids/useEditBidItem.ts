import { useQueryClient, useMutation } from 'react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { ApiService } from '../../../services/ApiService';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { BidItem } from '../../../models/Tender';

export interface BidItemResponse
	extends Pick<
		BidItem,
		'bidId' | 'bidItemId' | 'nr' | 'description' | 'volume' | 'unit' | 'cost'
	> {}

export const useEditBidItem = () => {
	const { bidId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, AxiosError, BidItemResponse>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editBidItem, variables, {
				withCredentials: true
			});

			if (response.status === 200) {
				await queryClient.refetchQueries(ApiService.getBidById(Number(bidId)));
			}
			return response.data;
		} catch (e) {
			throw new Error('Could not edit bid item');
		}
	});
};
