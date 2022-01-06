import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

interface ResourceCommentInput {
	resourceId: number;
	comment: string;
}

export const useResourceComment = () => {
	const queryClient = useQueryClient();

	return useMutation<{ data: { id: number } }, ErrorResponse, ResourceCommentInput>(
		async (variables) =>
			await axios.post(ApiService.resourceComment, variables, { withCredentials: true }),
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(
					ApiService.getResourceComments(variables.resourceId)
				);
			}
		}
	);
};
