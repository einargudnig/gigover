import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export interface BidByIdResponse {
	bid: Bid;
}

export const useClientGetBidById = (bidId: number) => {
	const { data, isLoading, isError, error } = useQuery<BidByIdResponse, ErrorResponse>({
		queryKey: [ApiService.getClientBidById(bidId)],
		refetchOnWindowFocus: true
	});

	console.log({ data });
	return {
		data,
		isLoading,
		isError,
		error
	};
};
