import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { CompleteTender } from '../../models/Tender';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface BidderTendersResponse {
	list: CompleteTender[];
}

export const useGetBidderTenders = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		BidderTendersResponse,
		ErrorResponse
	>(ApiService.bidderTenders, {
		refetchOnWindowFocus: true
	});
	const tenders: CompleteTender[] = data?.list || [];

	return {
		data: tenders,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
