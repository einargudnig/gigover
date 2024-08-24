import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OrganizationId } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

export const useDeclineOrganizationInvite = () => {
	const client = useQueryClient();

	return useMutation<OrganizationId, ErrorResponse, OrganizationId>(
		async (orgId) => {
			await axios.post(ApiService.rejectOrganizationInvite, orgId, {
				withCredentials: true
			});
			return orgId;
		},
		{
			onSuccess: async () => {
				await client.refetchQueries(ApiService.getUserInvites);
				await client.refetchQueries(ApiService.getOrganizations);
				await client.refetchQueries(ApiService.getUserInfo);
			}
		}
	);
};
