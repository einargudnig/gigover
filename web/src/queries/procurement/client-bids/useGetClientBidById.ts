import { useQuery } from 'react-query';
import { ApiService } from '../../../services/ApiService';
import { ClientBid } from '../../../models/Tender';
import { ErrorResponse } from '../../../models/ErrorResponse';

export interface ClientBidByIdResponse {
	clientBid: ClientBid;
}

export const useGetClientBidById = (clientBidId: number) => {
	const { data, isLoading, isError, error } = useQuery<ClientBidByIdResponse, ErrorResponse>(
		ApiService.getClientBidsById(clientBidId),
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
