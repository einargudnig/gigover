import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Organization } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface OrganizationsResponse {
	organizations: Organization[];
}

export const useGetOrganizations = (options = {}) => {
	const { data, isPending, isFetching, isError, error } = useQuery<
		OrganizationsResponse,
		ErrorResponse
	>({
		queryKey: [ApiService.getOrganizations],
		queryFn: async () => {
			const response = await axios.get(ApiService.getOrganizations, {
				withCredentials: true
			});
			return response.data;
		},
		...options
	});

	const organizations: Organization[] = data?.organizations || [];

	return {
		data: organizations,
		isPending,
		isFetching,
		isError,
		error
	};
};
