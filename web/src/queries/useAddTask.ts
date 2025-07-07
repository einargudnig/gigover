import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '../models/Task';
import { ApiService } from '../services/ApiService';

export interface TaskFormData
	extends Pick<Task, 'projectId' | 'typeId' | 'status' | 'lexoRank' | 'subject'> {
	taskId?: number;
}

export const useAddTask = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, Error, TaskFormData>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.addTask, variables, {
				withCredentials: true
			});

			if (response.data.errorText !== undefined) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},

		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: [ApiService.projectDetails(variables.projectId)]
			});

			if (variables.taskId) {
				await queryClient.invalidateQueries({
					queryKey: [ApiService.taskDetails(variables.taskId)]
				});
			}
		}
	});
};
