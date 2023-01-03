import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';

export const useGetProjectTenders = (projectId: number) =>
	useQuery(ApiService.projectTenders(projectId), {
		refetchOnWindowFocus: true
	});
