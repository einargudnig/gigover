import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { CompleteTender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface TenderResponse {
	list: CompleteTender[];
}

export const useUserTenders = () => {
	const { data, isPending, isError, error } = useQuery<TenderResponse, ErrorResponse>({
		queryKey: [ApiService.userTenders],
		queryFn: async () => {
			const response = await axios.get(ApiService.userTenders, {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true
		// withCredentials: true
	});

	const tenders: CompleteTender[] = data?.list || [];

	return {
		data: tenders,
		isPending,
		isError,
		error
	};
};
