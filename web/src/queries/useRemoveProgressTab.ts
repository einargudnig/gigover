import { useMutation, useQueryClient } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';

interface RemoveProgressTabInput {
	progressId: number;
}

export const useRemoveUser = (progressId: number) => {
	const queryClient = useQueryClient();

	return useMutation<unknown, ErrorResponse, RemoveProgressTabInput>(
		async (variables) =>
			await axios.post(ApiService.removeProgressStatus(progressId), variables, {
				withCredentials: true
			})
		//! I should refetch the project details here
		// for that I will need to pass the projectId as well
		// {
		// 	onSuccess: async (data, variables) => {
		// 		await queryClient.invalidateQueries(ApiService.projectDetails(variables.projectId));
		// 	}
		// }
	);
};
