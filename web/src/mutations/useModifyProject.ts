import { Project, ProjectStatus } from '../models/Project';
import { useMutation, useQueryClient } from 'react-query';
import { ProjectResponse } from '../queries/useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

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

	return useMutation<ProjectResponse, ErrorResponse, ProjectFormData | CloseProjectData>(
		async (project) =>
			await axios.post(ApiService.modifyProject, project, { withCredentials: true }),
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(ApiService.projectList);
				await queryClient.refetchQueries(ApiService.projectList);

				if (variables.projectId) {
					await queryClient.invalidateQueries(
						ApiService.projectDetails(variables.projectId)
					);
				}
			}
		}
	);
};
