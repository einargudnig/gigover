import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Tender } from '../models/Tender';
import { ErrorResponse } from '../models/ErrorResponse';

export interface BidderTendersResponse {
	list: Tender[];
}

export const useGetBidderTenders = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		BidderTendersResponse,
		ErrorResponse
	>(ApiService.bidderTenders, {
		refetchOnWindowFocus: true
	});
	const tenders: Tender[] = data?.list || [];

	return {
		data: tenders,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
