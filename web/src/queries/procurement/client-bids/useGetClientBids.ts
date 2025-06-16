import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export interface ClientBidResponse {
	list: Bid[];
}

export const useGetClientBids = () => {
	const { data, isPending, isSuccess, isError, error } = useQuery<
		ClientBidResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getClientBids],
		queryFn: async () => {
			const response = await axios.get(ApiService.getClientBids, {
				withCredentials: true
			});
			return response.data;
		},
		staleTime: 1000 * 60 * 5 // 5 minutes
	});
	const bids: Bid[] = data?.list || [];

	return {
		data: bids,
		isPending,
		isError,
		isSuccess,
		error
	};
};
