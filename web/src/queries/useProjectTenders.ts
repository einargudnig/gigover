import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';

export const useProjectTenders = (projectId: number) => {
	return useQuery(ApiService.projectTenders(projectId));
};
