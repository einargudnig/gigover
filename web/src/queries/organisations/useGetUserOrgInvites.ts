import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OrganizationInvites } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface OrgInvitesResponse {
	invites: OrganizationInvites[];
}

export const useGetUserOrgInvites = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		OrgInvitesResponse,
		ErrorResponse
	>({ queryKey: [ApiService.getUserOrgInvites] });

	const invites: OrganizationInvites[] = data?.invites || [];

	return {
		data: invites,
		isLoading,
		isFetching,
		isError,
		error
	};
};
