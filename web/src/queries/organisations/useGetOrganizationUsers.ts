import { useQuery } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';

interface OrgUsers {
	uId: string;
	name: string;
	email: string;
	priv: string;
}

interface OrganizationUsersResponse {
	organizationUsers: OrgUsers[];
}

export const useGetOrganizationUsers = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		OrganizationUsersResponse,
		ErrorResponse
	>(ApiService.getOrganizationUsers, {
		refetchOnWindowFocus: true
	});

	// Ensure the object structure matches OrganizationUsersResponse
	const organizationUsers: OrganizationUsersResponse = {
		organizationUsers: data?.organizationUsers || []
	};

	return {
		data: organizationUsers,
		isLoading,
		isFetching,
		isError,
		error
	};
};
