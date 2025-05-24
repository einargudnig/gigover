import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { CompleteTender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface TenderResponse {
	list: CompleteTender[];
}

export const useUserTenders = () => {
	const { data, isLoading, isError, error } = useQuery<TenderResponse, ErrorResponse>({
		queryKey: [ApiService.userTenders],
		refetchOnWindowFocus: true
		// withCredentials: true
	});

	const tenders: CompleteTender[] = data?.list || [];

	return {
		data: tenders,
		isLoading,
		isError,
		error
	};
};
