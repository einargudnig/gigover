import { Project } from '../models/Project';
import { useMutation, useQueryCache } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

interface OptionalProjectId {
	projectId?: number;
}

export interface ProjectFormData
	extends OptionalProjectId,
		Pick<Project, 'name' | 'description' | 'status'> {}

export const useModifyProject = ({ projectId }: OptionalProjectId) => {
	const queryCache = useQueryCache();

	return useMutation<ProjectResponse, ErrorResponse, ProjectFormData>(
		async (project) =>
			await axios.post(ApiService.modifyProject, project, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryCache.invalidateQueries(ApiService.projectList);

				if (projectId) {
					await queryCache.invalidateQueries(ApiService.projectDetails(projectId));
				}
			}
		}
	);
};
