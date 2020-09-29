import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { Project } from '../models/Project';

interface ProjectDetailsResponse {
	project: Project;
}

export const useProjectDetails = (projectId: number) =>
	useQuery<ProjectDetailsResponse, ErrorResponse>(ApiService.projectDetails(projectId), {
		refetchOnWindowFocus: true,
	});
