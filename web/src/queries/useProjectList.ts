import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Project } from '../models/Project';
import { ErrorResponse } from '../models/ErrorResponse';

export interface ProjectResponse {
	projects: Project[];
}

export const projectSorter = (a: Project, b: Project) => {
	if (a.lexoRank && b.lexoRank) {
		return a.lexoRank === b.lexoRank ? 0 : a.lexoRank > b.lexoRank ? 1 : -1;
	}
	if (a.lexoRank) {
		return 1;
	}

	return -1;
};

export const useProjectList = () => {
	const { data, isLoading, isError, error } = useQuery<
		ProjectResponse,
		ErrorResponse,
		ProjectResponse
	>(ApiService.projectList);

	const projects: Project[] = data?.projects || [];

	return {
		data: projects.sort(projectSorter),
		// data: projects,
		isLoading,
		isError,
		error
	};
};
