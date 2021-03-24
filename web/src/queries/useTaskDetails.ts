import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Task } from '../models/Task';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectStatusType } from '../models/Project';

export type ProjectTask = {
	project: {
		ownerAvatar: string;
		ownerName: string;
		projectId: number;
		status: ProjectStatusType;
	};
} & Pick<Task, 'status' | 'taskId' | 'comments' | 'text' | 'startDate' | 'endDate' | 'typeId'>;

interface TaskDetailsResponse {
	projectTask: ProjectTask;
}

export const useTaskDetails = (taskId: number) =>
	useQuery<TaskDetailsResponse, ErrorResponse>(ApiService.taskDetails(taskId), {
		refetchOnWindowFocus: true,
		refetchInterval: 10000
	});
