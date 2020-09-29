import { Project, ProjectStatus } from '../models/Project';
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

export interface CloseProjectData extends Pick<Project, 'projectId'> {
	status: typeof ProjectStatus.DONE;
}

export const useModifyProject = () => {
	const queryCache = useQueryCache();

	return useMutation<ProjectResponse, ErrorResponse, ProjectFormData | CloseProjectData>(
		async (project) =>
			await axios.post(ApiService.modifyProject, project, { withCredentials: true }),
		{
			onSuccess: async (data, variables) => {
				await queryCache.invalidateQueries(ApiService.projectList);

				if (variables.projectId) {
					await queryCache.invalidateQueries(
						ApiService.projectDetails(variables.projectId)
					);
				}
			}
		}
	);
};
