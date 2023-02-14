import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Tender } from '../models/Tender';
import { ErrorResponse } from '../models/ErrorResponse';

export interface TenderByIdResponse {
	tender: Tender;
}

export const useTenderById = (tenderId: number) => {
	const { data, isLoading, isSuccess, isError, error } = useQuery<
		TenderByIdResponse,
		ErrorResponse
	>(ApiService.getTenderById(tenderId), {
		refetchOnWindowFocus: true
		// withCredentials: true
	});

	return {
		data,
		isLoading,
		isError,
		isSuccess,
		error
	};
};
