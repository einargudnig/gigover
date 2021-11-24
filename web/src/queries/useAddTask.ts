import { useMutation, useQueryClient } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Task } from '../models/Task';

export interface TaskFormData extends Pick<Task, 'projectId' | 'typeId' | 'text' | 'status' | 'rank'> {
	taskId?: number;
}

export const useAddTask = () => {
	const queryClient = useQueryClient();

	return useMutation<ProjectResponse, ErrorResponse, TaskFormData>(
		async (variables) => {
			const response = await axios.post(ApiService.addTask, variables, {
				withCredentials: true
			});

			if (response.data.errorText !== undefined) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(ApiService.projectDetails(variables.projectId));

				if (variables.taskId) {
					await queryClient.invalidateQueries(ApiService.taskDetails(variables.taskId));
				}
			}
		}
	);
};
