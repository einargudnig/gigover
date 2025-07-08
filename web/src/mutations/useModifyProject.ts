import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Project, ProjectStatus } from '../models/Project';
import { ProjectResponse } from '../queries/useProjectList';
import { ApiService } from '../services/ApiService';

interface OptionalProjectId {
	projectId?: number;
}

export interface ProjectFormData
	extends OptionalProjectId,
		Pick<
			Project,
			| 'name'
			| 'description'
			| 'status'
			| 'startDate'
			| 'endDate'
			| 'lexoRank'
			| 'progressStatus'
		> {}

export interface CloseProjectData extends Pick<Project, 'projectId'> {
	status: typeof ProjectStatus.DONE;
}

export const useModifyProject = () => {
	const queryClient = useQueryClient();

	return useMutation<ProjectResponse, ErrorResponse, ProjectFormData | CloseProjectData>({
		mutationKey: ['modifyProject'],
		mutationFn: async (project) => {
			const response = await axios.post(ApiService.modifyProject, project, {
				withCredentials: true
			});
			return response.data;
		},
		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
			await queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });

			if (variables.projectId) {
				await queryClient.invalidateQueries({
					queryKey: [ApiService.projectDetails(variables.projectId)]
				});
			}
		}
	});
};
