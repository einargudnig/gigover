import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

interface RemoveINviteToOrganizationInput {
	uId: string;
}

export const useRemoveInviteToOrganization = () => {
	const queryClient = useQueryClient();
	const mutationKey = ApiService.removeInviteToOrganization;

	return useMutation<ErrorResponse, AxiosError, RemoveINviteToOrganizationInput>(
		mutationKey,
		async (variables) => {
			try {
				console.log('IN MUTATION', { variables });
				const response = await axios.post<ErrorResponse>(mutationKey, variables, {
					withCredentials: true
				});

				if (response.data.errorCode !== 'OK') {
					throw new Error(response.data?.errorCode);
				}

				// we want to refetch this query so the organizations updates after we invite a user.
				queryClient.refetchQueries(ApiService.getOrganizationUsers);
				queryClient.refetchQueries(ApiService.getOrganizations);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	);
};
