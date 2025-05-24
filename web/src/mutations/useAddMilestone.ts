import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MilestoneForm } from '../models/Milestone';
import { ApiService } from '../services/ApiService';

interface MilestoneFormInput extends Omit<MilestoneForm, 'milestoneId'> {
	milestoneId?: number;
}

export const useAddMilestone = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, Error, MilestoneFormInput>({
		mutationFn: async (variables) => {
			const response = await axios.post(ApiService.addMilestone, variables, {
				withCredentials: true
			});

			if (response.data.errorText !== undefined) {
				throw new Error(response.data.errorText);
			}

			return response.data;
		},

		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({
				queryKey: [ApiService.getMilestones(variables.projectId)]
			});

			if (variables.milestoneId) {
				await queryClient.invalidateQueries({
					queryKey: [ApiService.milestoneDetails(variables.milestoneId)]
				});
			}
		}
	});
};
