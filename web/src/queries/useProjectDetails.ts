import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Project } from '../models/Project';
import { ApiService } from '../services/ApiService';

interface ProjectDetailsResponse {
	project: Project;
}

export const useProjectDetails = (projectId: number) =>
	useQuery<ProjectDetailsResponse, ErrorResponse>({
		queryKey: [ApiService.projectDetails(projectId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.projectDetails(projectId), {
				withCredentials: true
			});
			return response.data;
		},
		enabled: !!projectId,
		refetchOnWindowFocus: true,
		refetchIntervalInBackground: false,
		refetchOnMount: true,
		refetchOnReconnect: true
	});
