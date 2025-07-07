import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export interface BidByIdResponse {
	bid: Bid;
}

export const useGetBidById = (bidId: number) => {
	const { data, isPending, isError, error } = useQuery<BidByIdResponse, ErrorResponse>({
		queryKey: [ApiService.getBidById(bidId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.getBidById(bidId), {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true
	});
	return {
		data,
		isPending,
		isError,
		error
	};
};
