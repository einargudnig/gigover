import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OrganizationId } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

export const useAcceptOrganizationInvite = () => {
	const client = useQueryClient();

	return useMutation({
        mutationFn: async (orgId) => {
			await axios.post(ApiService.acceptOrganizationInvite, orgId, {
				withCredentials: true
			});
			return orgId;
		},

        onSuccess: async () => {
            await client.refetchQueries(ApiService.getUserInvites);
            await client.refetchQueries(ApiService.getOrganizations);
            await client.refetchQueries(ApiService.getUserInfo);
        }
    });
};
