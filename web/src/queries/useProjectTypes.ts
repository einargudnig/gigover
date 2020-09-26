import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectType } from '../models/ProjectType';

interface ProjectTypesResponse {
	projectTypes: ProjectType[];
}

export const useProjectTypes = () =>
	useQuery<ProjectTypesResponse, ErrorResponse>(ApiService.projectTypes, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
