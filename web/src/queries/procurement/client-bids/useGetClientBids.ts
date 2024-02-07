import { useQuery } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { ClientBid } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface ClientBidResponse {
	list: ClientBid[];
}

export const useGetClientBids = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		ClientBidResponse,
		ErrorResponse
	>(ApiService.getClientBids, {
		refetchOnWindowFocus: true
	});
	const clientBids: ClientBid[] = data?.list || [];

	return {
		data: clientBids,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
