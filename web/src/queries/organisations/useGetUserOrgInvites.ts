import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OrganizationInvites } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface OrgInvitesResponse {
	organizationUsers: OrganizationInvites[];
}

export const useGetUserOrgInvites = () => {
	const { data, isPending, isFetching, isError, error } = useQuery<
		OrgInvitesResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getUserOrgInvites],
		queryFn: async () => {
			const response = await axios.get(ApiService.getUserOrgInvites, {
				withCredentials: true
			});
			return response.data;
		}
	});

	const invites: OrganizationInvites[] = data?.organizationUsers || [];

	return {
		data: invites,
		isPending,
		isFetching,
		isError,
		error
	};
};
