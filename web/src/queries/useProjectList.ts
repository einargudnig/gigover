import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Project } from '../models/Project';
import { ErrorResponse } from '../models/ErrorResponse';

export interface ProjectResponse {
	projects: Project[];
}

export const useProjectList = () => {
	const { data, isLoading, isError, error } = useQuery<
		ProjectResponse,
		ErrorResponse,
		ProjectResponse
	>(ApiService.projectList, {
		refetchOnWindowFocus: true
	});

	return {
		data: data?.projects || ([] as Project[]),
		isLoading,
		isError,
		error
	};
};
