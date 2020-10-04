import { useMutation, useQueryCache } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Task } from '../models/Task';

export interface TaskFormData extends Pick<Task, 'projectId' | 'typeId' | 'text' | 'status'> {
	taskId?: number;
}

export const useAddTask = () => {
	const queryCache = useQueryCache();

	return useMutation<ProjectResponse, ErrorResponse, TaskFormData>(
		async (variables) =>
			await axios.post(ApiService.addTask, variables, { withCredentials: true }),
		{
			onSuccess: async (data, variables) => {
				await queryCache.invalidateQueries(ApiService.projectDetails(variables.projectId));

				if (variables.taskId) {
					await queryCache.invalidateQueries(ApiService.taskDetails(variables.taskId));
				}
			}
		}
	);
};
