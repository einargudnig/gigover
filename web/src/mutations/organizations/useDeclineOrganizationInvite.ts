import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';

export const useDeclineOrganizationInvite = () => {
	const client = useQueryClient();

	return useMutation<void, AxiosError, number>({
		mutationKey: [ApiService.rejectOrganizationInvite],
		mutationFn: async (orgId: number) => {
			await axios.post(
				ApiService.rejectOrganizationInvite,
				{ id: orgId },
				{
					withCredentials: true
				}
			);
		},

		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: [ApiService.getUserInvites] });
			await client.invalidateQueries({ queryKey: [ApiService.getOrganizations] });
			await client.invalidateQueries({ queryKey: [ApiService.getUserInfo] });
		}
	});
};
