import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';

interface InviteUserToOrganizationInput {
	email: string;
	priv: 'A' | 'E' | 'V';
}

export const useInviteUserToOrganization = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.addUser;

	return useMutation<ErrorResponse, AxiosError, InviteUserToOrganizationInput>(
		mutationKey,
		async (variables) => {
			try {
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				// we want to refetch this query so the user table updates after we invite a user.
				queryClient.refetchQueries(ApiService.inviteToOrganization);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
