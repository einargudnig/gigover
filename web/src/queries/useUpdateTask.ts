import { useMutation, useQueryCache } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { TaskStatusType } from '../models/Task';

export interface UpdateTaskFormData {
	taskId: number;
	status: TaskStatusType;
	comment: string;
}

export const useUpdateTask = (projectId: number) => {
	const queryCache = useQueryCache();

	return useMutation<ProjectResponse, ErrorResponse, UpdateTaskFormData>(
		async (variables) =>
			await axios.post(ApiService.updateTask, variables, { withCredentials: true }),
		{
			onSuccess: async (data, variables) => {
				await queryCache.invalidateQueries(ApiService.projectList);
				await queryCache.invalidateQueries(ApiService.projectDetails(projectId));

				if (variables.taskId) {
					await queryCache.invalidateQueries(ApiService.taskDetails(variables.taskId));
				}
			}
		}
	);
};
