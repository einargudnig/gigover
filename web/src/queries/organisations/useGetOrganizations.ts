import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Organization } from '../../models/Organizations';

interface OrganizationsResponse {
	organizations: Organization[];
}

export const useGetOrganizations = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		OrganizationsResponse,
		ErrorResponse
	>(ApiService.getOrganizations, {
		refetchOnWindowFocus: true
		// withCredentials: true
	});

	const organizations: Organization[] = data?.organizations || [];

	return {
		data: organizations,
		isLoading,
		isFetching,
		isError,
		error
	};
};
