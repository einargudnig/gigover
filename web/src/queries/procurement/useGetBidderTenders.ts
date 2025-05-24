import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { CompleteTender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface BidderTendersResponse {
	list: CompleteTender[];
}

export const useGetBidderTenders = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		BidderTendersResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.bidderTenders],
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
