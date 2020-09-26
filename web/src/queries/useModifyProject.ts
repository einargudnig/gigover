import { Project } from '../models/Project';
import { useMutation, useQueryCache } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

export interface ProjectFormData extends Pick<Project, 'name' | 'description' | 'status'> {
	projectId?: number;
}

export const useModifyProject = () => {
	const queryCache = useQueryCache();

	return useMutation<ProjectResponse, ErrorResponse, ProjectFormData>(
		async (project) =>
			await axios.post(ApiService.modifyProject, project, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryCache.invalidateQueries(ApiService.projectList);
			}
		}
	);
};
