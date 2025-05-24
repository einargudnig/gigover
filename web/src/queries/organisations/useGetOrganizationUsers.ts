import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
	>({
		queryKey: [ApiService.getOrganizationUsers],
		queryFn: async () => {
			const response = await axios.get(ApiService.getOrganizationUsers, {
				withCredentials: true
			});
			return response.data;
		}
	});

	const users: OrgUsers[] = data?.organizationUsers || [];

	return {
		data: { organizationUsers: users },
		isLoading,
		isFetching,
		isError,
		error
	};
};
