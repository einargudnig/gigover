import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface InviteUserToOrganizationInput {
	email: string; // email of the user we want to invite
	uId: string; // the user id of the user who owns the organization
	priv: 'A' | 'E' | 'V';
}

export const useInviteUserToOrganization = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.inviteToOrganization;

	return useMutation({
        mutationKey: mutationKey,

        mutationFn: async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				// we want to refetch this query so the organizations updates after we invite a user.
				queryClient.refetchQueries(ApiService.getOrganizationUsers);
				queryClient.refetchQueries(ApiService.getUserOrgInvites);
				queryClient.refetchQueries(ApiService.getUserInfo);
				queryClient.refetchQueries(ApiService.getOrganizations);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
    });
};
