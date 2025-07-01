import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';

export const useDeleteOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation<void, AxiosError, number>({
		mutationKey: [ApiService.deleteOrganization],
		mutationFn: async (organizationId: number) => {
			await axios.post(
				ApiService.deleteOrganization,
				{ id: organizationId },
				{ withCredentials: true }
			);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.getOrganizations] });
			await queryClient.invalidateQueries({ queryKey: [ApiService.getUserInfo] });
		}
	});
};
