import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LexoRank } from 'lexorank';
import { ErrorResponse } from '../models/ErrorResponse';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { ApiService } from '../services/ApiService';
import { ProjectResponse } from './useProjectList';

export interface UpdateTaskFormData
	extends Pick<Task, 'taskId' | 'status' | 'typeId' | 'text' | 'subject'> {
	startDate?: number | null;
	endDate?: number | null;
	comment?: string;
	lexoRank?: string;
	priority?: number;
	worker?: { uId?: number | string };
}

export const useUpdateTask = (projectId: number) => {
	const queryClient = useQueryClient();

	return useMutation<ProjectResponse, ErrorResponse, UpdateTaskFormData>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.updateTask, variables, {
				withCredentials: true
			});
			return response.data;
		},
		onMutate: async (variables) => {
			const cacheKeyArray = [ApiService.projectDetails(projectId)];
			const projectDetails = queryClient.getQueryData<{ project: Project }>(cacheKeyArray);

			if (projectDetails) {
				const tasks = [...projectDetails.project.tasks];
				const taskIndex = tasks.findIndex((task) => task.taskId === variables.taskId);

				if (taskIndex !== -1) {
					tasks[taskIndex] = {
						...tasks[taskIndex],
						text: variables.text,
						subject: variables.subject,
						typeId: variables.typeId,
						status: variables.status,
						lexoRank: variables.lexoRank ?? LexoRank.middle().toString()
					};

					const newProjectDetails = {
						project: {
							...projectDetails.project,
							tasks: tasks
						}
					};

					await queryClient.setQueryData(cacheKeyArray, newProjectDetails);
				}
			}
		},
		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
			await queryClient.invalidateQueries({
				queryKey: [ApiService.projectDetails(projectId)]
			});

			if (variables.taskId) {
				await queryClient.invalidateQueries({
					queryKey: [ApiService.taskDetails(variables.taskId)]
				});
			}
		}
	});
};
