import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface TaskCommentData {
	projectId: number;
	taskId: number;
	imageId?: number;
	comment: string;
}

export const useTaskComment = () => {
	const queryClient = useQueryClient();

	return useMutation<{ data: ErrorResponse }, ErrorResponse, TaskCommentData>({
		mutationFn: async (variables) =>
			await axios.post(ApiService.addComment, variables, { withCredentials: true }),
		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: [ApiService.taskDetails(variables.taskId)]
			});
		}
	});
};
