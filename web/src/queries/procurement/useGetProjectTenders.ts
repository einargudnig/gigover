import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Tender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface TenderResponse {
	list: Tender[];
}

export const useGetProjectTenders = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<TenderResponse, ErrorResponse>({
		queryKey: [ApiService.projectTenders(projectId)],
		refetchOnWindowFocus: true
	});
	const tenders: Tender[] = data?.list || [];

	return {
		data: tenders,
		isLoading,
		isError,
		error
	};
};
