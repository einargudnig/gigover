import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { Task } from '../models/Task';
import { ApiService } from '../services/ApiService';
import { ProjectResponse } from './useProjectList';

export interface TaskFormData
	extends Pick<Task, 'projectId' | 'typeId' | 'status' | 'lexoRank' | 'subject'> {
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
