import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { TaskComment } from '../models/TaskComment';
import { TaskStatusType } from '../models/Task';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectStatusType } from '../models/Project';

interface TaskDetailsResponse {
	projectTask: {
		project: {
			ownerAvatar: string;
			ownerName: string;
			projectId: number;
			status: ProjectStatusType;
		};
		status: TaskStatusType;
		taskId: number;
		text: string;
		typeId: number;
		comments: TaskComment[];
	};
}

export const useTaskDetails = (taskId: number) =>
	useQuery<TaskDetailsResponse, ErrorResponse>(ApiService.taskDetails(taskId), {
		refetchOnWindowFocus: true,
		refetchInterval: 10000
	});
