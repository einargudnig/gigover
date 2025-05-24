import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Organization } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface OrganizationsResponse {
	organizations: Organization[];
}

export const useGetOrganizations = () => {
	const { data, isLoading, isFetching, isError, error } = useQuery<
		OrganizationsResponse,
		ErrorResponse
	>({ queryKey: [ApiService.getOrganizations] });

	const organizations: Organization[] = data?.organizations || [];

	return {
		data: organizations,
		isLoading,
		isFetching,
		isError,
		error
	};
};
