import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectType } from '../models/ProjectType';
import { ApiService } from '../services/ApiService';

interface ProjectTypesResponse {
	projectTypes: ProjectType[];
}

export const useProjectTypes = () =>
	useQuery<ProjectTypesResponse, ErrorResponse>({
		queryKey: [ApiService.projectTypes],
		initialData: {
			projectTypes: []
		}
	});
