import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Project } from '../models/Project';
import { ApiService } from '../services/ApiService';

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
	const { data, isPending, isFetching, isError, error } = useQuery<
		ProjectResponse,
		ErrorResponse,
		ProjectResponse
	>({
		queryKey: [ApiService.projectList],
		queryFn: async () => {
			const response = await axios.get(ApiService.projectList, {
				withCredentials: true
			});
			return response.data;
		}
	});

	const projects: Project[] = data?.projects || [];

	// call the useGetUserPermissions hook to get the active organization
	// filter projects based on the active organization

	return {
		data: projects.sort(projectSorter),
		// data: projects,
		isPending,
		isFetching,
		isError,
		error
	};
};
