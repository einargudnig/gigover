import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectType } from '../models/ProjectType';
import { ApiService } from '../services/ApiService';

interface ProjectTypesResponse {
	projectTypes: ProjectType[];
}

export const useProjectTypes = () =>
	useQuery<ProjectTypesResponse, ErrorResponse>({
		queryKey: [ApiService.projectTypes],
		queryFn: async () => {
			const response = await axios.get(ApiService.projectTypes, {
				withCredentials: true
			});
			return response.data;
		},
		initialData: {
			projectTypes: []
		}
	});
