import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { Tender } from '../../models/Tender';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface TenderResponse {
	list: Tender[];
}

export const useGetProjectTenders = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<TenderResponse, ErrorResponse>(
		ApiService.projectTenders(projectId),
		{
			refetchOnWindowFocus: true
		}
	);
	const tenders: Tender[] = data?.list || [];

	return {
		data: tenders,
		isLoading,
		isError,
		error
	};
};
