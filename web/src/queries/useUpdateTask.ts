import { useMutation, useQueryCache } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { TaskStatusType } from '../models/Task';
import { Project } from '../models/Project';

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
			onMutate: async (variables) => {
				const cacheKey = ApiService.projectDetails(projectId);
				const projectDetails = queryCache.getQueryData(cacheKey) as { project: Project };

				if (projectDetails) {
					const tasks = [...projectDetails.project.tasks];
					const taskIndex = tasks.findIndex((task) => task.taskId === variables.taskId);

					if (taskIndex !== -1) {
						tasks[taskIndex] = {
							...tasks[taskIndex],
							status: variables.status
						};

						const newProjectDetails = {
							project: {
								...projectDetails.project,
								tasks: tasks
							}
						};

						await queryCache.setQueryData(cacheKey, newProjectDetails);
					}
				}
			},
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
