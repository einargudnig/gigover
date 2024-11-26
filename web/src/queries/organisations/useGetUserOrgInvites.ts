import { useQuery } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { OrganizationInvites } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface OrganizationsResponse {
	organizationUsers: OrganizationInvites[];
}

export const useGetUserOrgInvites = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		OrganizationsResponse,
		ErrorResponse
	>(ApiService.getUserOrgInvites, {
		refetchOnWindowFocus: true
		// withCredentials: true
	});

	const organizationsInvites: OrganizationInvites[] = data?.organizationUsers || [];

	return {
		data: organizationsInvites,
		isLoading,
		isFetching,
		isError,
		error
	};
};
