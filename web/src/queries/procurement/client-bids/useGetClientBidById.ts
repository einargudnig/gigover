import { useQuery } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { Bid } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface BidByIdResponse {
	bid: Bid;
}

export const useClientGetBidById = (bidId: number) => {
	const { data, isLoading, isError, error } = useQuery<BidByIdResponse, ErrorResponse>(
		ApiService.getClientBidById(bidId),
		{
			refetchOnWindowFocus: true
		}
	);

	console.log({ data });
	return {
		data,
		isLoading,
		isError,
		error
	};
};
