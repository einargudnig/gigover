import { useMutation, useQueryCache } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Task } from '../models/Task';

export interface TaskFormData extends Pick<Task, 'projectId' | 'typeId' | 'text' | 'status'> {}

export const useModifyTask = (projectId: number) => {
	const queryCache = useQueryCache();

	return useMutation<ProjectResponse, ErrorResponse, TaskFormData>(
		async (variables) =>
			await axios.post(ApiService.modifyTask, variables, { withCredentials: true }),
		{
			onSuccess: async () => {
				await queryCache.invalidateQueries(ApiService.projectDetails(projectId));
			}
		}
	);
};
