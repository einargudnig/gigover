import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../../models/ErrorResponse';
import { Bid } from '../../../models/Tender';
import { ApiService } from '../../../services/ApiService';

export interface ClientBidResponse {
	list: Bid[];
}

export const useGetClientBids = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		ClientBidResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getClientBids],
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
