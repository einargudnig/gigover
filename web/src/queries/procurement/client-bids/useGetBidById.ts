import { useQuery } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { Bid } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface ClientBidByIdResponse {
	clientBid: Bid;
}

export const useGetBidById = (bidId: number) => {
	const { data, isLoading, isError, error } = useQuery<ClientBidByIdResponse, ErrorResponse>(
		ApiService.getBidById(bidId),
		{
			refetchOnWindowFocus: true
		}
	);

	return {
		data,
		isLoading,
		isError,
		error
	};
};
