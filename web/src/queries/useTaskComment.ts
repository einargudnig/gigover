import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

interface TaskCommentData {
	projectId: number;
	taskId: number;
	comment: string;
}

export const useTaskComment = () => {
	const queryClient = useQueryClient();

	return useMutation<{ data: ErrorResponse }, ErrorResponse, TaskCommentData>(
		async (variables) =>
			await axios.post(ApiService.addComment, variables, { withCredentials: true }),
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(ApiService.taskDetails(variables.taskId));
			}
		}
	);
};
