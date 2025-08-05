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

interface UpdateTaskContext {
	previousProjectDetails: { project: Project } | null;
	previousTask: Task | null;
}

export const useUpdateTask = (projectId: number) => {
	const queryClient = useQueryClient();

	return useMutation<ProjectResponse, ErrorResponse, UpdateTaskFormData, UpdateTaskContext>({
		mutationFn: async (variables) => {
			console.log('🚀 Starting task update mutation:', variables);
			const response = await axios.post(ApiService.updateTask, variables, {
				withCredentials: true
			});
			return response.data;
		},
		onMutate: async (variables) => {
			console.log('📝 Starting optimistic update for task:', variables.taskId);

			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: [ApiService.projectDetails(projectId)] });

			const cacheKeyArray = [ApiService.projectDetails(projectId)];
			const previousProjectDetails = queryClient.getQueryData<{ project: Project }>(
				cacheKeyArray
			);

			if (previousProjectDetails) {
				const tasks = [...previousProjectDetails.project.tasks];
				const taskIndex = tasks.findIndex((task) => task.taskId === variables.taskId);

				if (taskIndex !== -1) {
					console.log('✅ Found task in cache, applying optimistic update');

					// Store the previous state for potential rollback
					const previousTask = tasks[taskIndex];

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
							...previousProjectDetails.project,
							tasks: tasks
						}
					};

					await queryClient.setQueryData(cacheKeyArray, newProjectDetails);
					console.log('✅ Optimistic update applied successfully');

					// Return context with the previous value for rollback
					return { previousProjectDetails, previousTask };
				} else {
					console.log('❌ Task not found in cache for optimistic update');
				}
			} else {
				console.log('❌ No project details found in cache for optimistic update');
			}

			return { previousProjectDetails: null, previousTask: null };
		},
		onError: (err, variables, context) => {
			console.log('❌ Task update failed, rolling back optimistic update:', err);

			// If we have context, rollback the optimistic update
			if (context?.previousProjectDetails) {
				const cacheKeyArray = [ApiService.projectDetails(projectId)];
				queryClient.setQueryData(cacheKeyArray, context.previousProjectDetails);
				console.log('🔄 Rolled back optimistic update');
			}
		},
		onSuccess: async (data, variables) => {
			console.log('✅ Task update successful, invalidating queries');

			await queryClient.invalidateQueries({ queryKey: [ApiService.projectList] });
			await queryClient.invalidateQueries({
				queryKey: [ApiService.projectDetails(projectId)]
			});

			if (variables.taskId) {
				await queryClient.invalidateQueries({
					queryKey: [ApiService.taskDetails(variables.taskId)]
				});
			}
		},
		onSettled: () => {
			console.log('🏁 Task update mutation settled');
		}
	});
};
