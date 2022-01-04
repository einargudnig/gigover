import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { TaskComment } from '../models/TaskComment';

export interface ResourceCommentsResponse {
	comments: Omit<TaskComment, 'taskId'>[];
}

export const useResourceComments = (resourceId: number) =>
	useQuery<ResourceCommentsResponse, ErrorResponse>(ApiService.getResourceComments(resourceId), {
		refetchOnWindowFocus: true
	});
