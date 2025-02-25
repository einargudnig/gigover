import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { CompleteTender } from '../../models/Tender';
import { ErrorResponse } from '../../models/ErrorResponse';

interface TenderByIdResponse {
	tender: CompleteTender;
}

export const useGetTenderById = (tenderId: number) => {
	const { data, isLoading, isError, error } = useQuery<TenderByIdResponse, ErrorResponse>(
		ApiService.getTenderById(tenderId),
		{
			refetchOnWindowFocus: true
		}
	);

	return {
		data, // Now this is the TenderWithItems directly
		isLoading,
		isError,
		error
	};
};
