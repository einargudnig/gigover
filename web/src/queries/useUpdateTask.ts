import { useMutation, useQueryClient } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Task } from '../models/Task';
import { Project } from '../models/Project';

export interface UpdateTaskFormData
	extends Pick<Task, 'taskId' | 'status' | 'typeId' | 'text' | 'lexoRank' | 'subject'> {
	startDate?: number | null;
	endDate?: number | null;
	comment?: string;
	priority?: number;
	worker?: { uId?: number | string };
}

export const useUpdateTask = (projectId: number) => {
	const queryClient = useQueryClient();

	return useMutation<ProjectResponse, ErrorResponse, UpdateTaskFormData>(
		async (variables) =>
			await axios.post(ApiService.updateTask, variables, { withCredentials: true }),
		{
			onMutate: async (variables) => {
				const cacheKey = ApiService.projectDetails(projectId);
				const projectDetails = queryClient.getQueryData(cacheKey) as { project: Project };

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
							lexoRank: variables.lexoRank
						};

						const newProjectDetails = {
							project: {
								...projectDetails.project,
								tasks: tasks
							}
						};

						await queryClient.setQueryData(cacheKey, newProjectDetails);
					}
				}
			},
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(ApiService.projectList);
				await queryClient.invalidateQueries(ApiService.projectDetails(projectId));

				if (variables.taskId) {
					await queryClient.invalidateQueries(ApiService.taskDetails(variables.taskId));
				}
			}
		}
	);
};
