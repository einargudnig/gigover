import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { TenderWithItems } from '../../models/Tender';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface TenderByIdResponse {
	tender: TenderWithItems;
}

export const useGetTenderById = (tenderId: number) => {
	const { data, isLoading, isError, error } = useQuery<TenderByIdResponse, ErrorResponse>(
		ApiService.getTenderById(tenderId),
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
