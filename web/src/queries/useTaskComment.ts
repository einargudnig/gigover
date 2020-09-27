import { useMutation } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

interface TaskCommentData {
	projectId: number;
	taskId: number;
	comment: string;
}

interface TaskCommentResponse {}

export const useTaskComment = () => {
	return useMutation<TaskCommentResponse, ErrorResponse, TaskCommentData>(
		async (variables) =>
			await axios.post(ApiService.addComment, variables, { withCredentials: true }),
		{
			onSuccess: (data, variables) => {
				console.log('TaskComment data', data);
				console.log('TaskComment variables', variables);
			}
		}
	);
};
