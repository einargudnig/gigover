import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Tender } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';

export interface ProjectTenderListResponse {
	list: Tender[];
}

export const useProjectTenders = (projectId: number) => {
	const { data, isPending, isError, error } = useQuery<ProjectTenderListResponse, ErrorResponse>({
		queryKey: [ApiService.projectTenders(projectId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.projectTenders(projectId), {
				withCredentials: true
			});
			return response.data;
		},
		refetchOnWindowFocus: true
	});

	const tenders: Tender[] = data?.list || [];

	return {
		data: tenders,
		isPending,
		isError,
		error
	};
};
