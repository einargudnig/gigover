import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Tender } from '../models/Tender';
import { ErrorResponse } from '../models/ErrorResponse';

export interface TenderResponse {
	list: Tender[];
}

export const useUserTenders = () => {
	const { data, isLoading, isError, error } = useQuery<TenderResponse, ErrorResponse>(
		ApiService.userTenders,
		{
			refetchOnWindowFocus: true
			// withCredentials: true
		}
	);

	// Why is it list??
	// I think it is because of the name of the response?
	// I name the TenderResponse list and type it with the Tender interface
	const tenders: Tender[] = data?.list || [];

	return {
		data: tenders,
		isLoading,
		isError,
		error
	};
};
