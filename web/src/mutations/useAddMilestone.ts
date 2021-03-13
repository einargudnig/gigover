import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { MilestoneForm } from '../models/Milestone';

interface MilestoneFormInput extends Omit<MilestoneForm, 'milestoneId'> {
	milestoneId?: number;
}

export const useAddMilestone = () => {
	const queryClient = useQueryClient();

	return useMutation<{ id: number }, ErrorResponse, MilestoneFormInput>(
		async (variables) => {
			const response = await axios.post(ApiService.addMilestone, variables, {
				withCredentials: true
			});

			if (response.data.errorText !== undefined) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(ApiService.getMilestones(variables.projectId));

				if (variables.milestoneId) {
					await queryClient.invalidateQueries(
						ApiService.milestoneDetails(variables.milestoneId)
					);
				}
			}
		}
	);
};
