import { useQuery } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { Bid } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface ClientBidResponse {
	list: Bid[];
}

export const useGetBids = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		ClientBidResponse,
		ErrorResponse
	>(ApiService.getBids, {
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
