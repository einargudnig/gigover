import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectStatusType } from '../models/Project';
import { Task } from '../models/Task';
import { ApiService } from '../services/ApiService';

export type ProjectTask = {
	project: {
		ownerAvatar: string;
		ownerName: string;
		projectId: number;
		status: ProjectStatusType;
	};
} & Pick<
	Task,
	| 'status'
	| 'taskId'
	| 'comments'
	| 'text'
	| 'startDate'
	| 'endDate'
	| 'typeId'
	| 'images'
	| 'subject'
>;

interface TaskDetailsResponse {
	projectTask: ProjectTask;
}

export const useTaskDetails = (taskId: number) =>
	useQuery<TaskDetailsResponse, ErrorResponse>(ApiService.taskDetails(taskId), {
		refetchOnWindowFocus: true,
		refetchInterval: 10000
	});
