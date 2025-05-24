import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface ResourceCommentInput {
	resourceId: number;
	comment: string;
}

export const useResourceComment = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, ErrorResponse, ResourceCommentInput>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.resourceComment, variables, {
				withCredentials: true
			});
			return response.data;
		},

		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: [ApiService.getResourceComments(variables.resourceId)]
			});
		}
	});
};
