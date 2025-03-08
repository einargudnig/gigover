import { useQuery } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { CompleteTender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

interface TenderByIdResponse {
	tender: CompleteTender;
}

export const useGetTenderById = (tenderId: number) => {
	const { data, isLoading, isError, error, isFetching } = useQuery<
		TenderByIdResponse,
		ErrorResponse
	>(ApiService.getTenderById(tenderId), {
		refetchOnWindowFocus: true
	});

	return {
		data, // Now this is the TenderWithItems directly
		isLoading,
		isError,
		error,
		isFetching
	};
};
