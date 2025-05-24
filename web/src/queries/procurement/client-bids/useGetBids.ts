import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export interface ClientBidResponse {
	list: Bid[];
}

export const useGetBids = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		ClientBidResponse,
		ErrorResponse
	>({
		queryKey: ['bids'],
		queryFn: async () => {
			const response = await axios.get(ApiService.getBids, {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true
	});
	const bids: Bid[] = data?.list || [];

	return {
		data: bids,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
