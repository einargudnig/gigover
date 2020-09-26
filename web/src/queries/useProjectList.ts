import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Project } from '../models/Project';
import { ErrorResponse } from '../models/ErrorResponse';

export interface ProjectResponse {
	projects: Project[];
}

export const useProjectList = () =>
	useQuery<ProjectResponse, ErrorResponse>(ApiService.projectList, {
		refetchOnWindowFocus: true
	});
