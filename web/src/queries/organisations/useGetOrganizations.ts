import { useQuery } from 'react-query';
import { ApiService } from '../../services/ApiService';
import { ErrorResponse } from '../../models/ErrorResponse';
import { Organization } from '../../models/Organizations';

export const useGetOrganizations = () => {
	const { data, isLoading, isError, error } = useQuery<Organization[], ErrorResponse>(
		ApiService.getOrganizations,
		{
			refetchOnWindowFocus: true
			// withCredentials: true
		}
	);

	const organisations = data || [];

	return {
		data: organisations,
		isLoading,
		isError,
		error
	};
};
