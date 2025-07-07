import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { CompleteTender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface BidderTendersResponse {
	list: CompleteTender[];
}

export const useGetBidderTenders = () => {
	const { data, isPending, isSuccess, isError, error } = useQuery<
		BidderTendersResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.bidderTenders],
		queryFn: async () => {
			const response = await axios.get(ApiService.bidderTenders, {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 5 // 5 minutes
	});

	const tenders: CompleteTender[] = data?.list || [];

	return {
		data: tenders,
		isPending,
		isError,
		isSuccess,
		error
	};
};
