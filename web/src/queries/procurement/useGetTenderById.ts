import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { CompleteTender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

interface TenderByIdResponse {
	tender: CompleteTender;
}

export const useGetTenderById = (tenderId: number) => {
	const { data, isPending, isError, error, isFetching } = useQuery<
		TenderByIdResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getTenderById(tenderId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.getTenderById(tenderId), {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true,
		enabled: !!tenderId
	});

	return {
		data, // Now this is the TenderWithItems directly
		isPending,
		isError,
		error,
		isFetching
	};
};
