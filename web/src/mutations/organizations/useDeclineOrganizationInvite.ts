import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../../services/ApiService';

export const useDeclineOrganizationInvite = () => {
	const client = useQueryClient();

	return useMutation({
		mutationKey: [ApiService.rejectOrganizationInvite],
		mutationFn: async (orgId) => {
			await axios.post(ApiService.rejectOrganizationInvite, orgId, {
				withCredentials: true
			});
			return orgId;
		},

		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: [ApiService.getUserInvites] });
			await client.invalidateQueries({ queryKey: [ApiService.getOrganizations] });
			await client.invalidateQueries({ queryKey: [ApiService.getUserInfo] });
		}
	});
};
