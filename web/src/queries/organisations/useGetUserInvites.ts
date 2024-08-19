import { useQuery } from 'react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { UserInvites } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface UserInvitesResponse {
	organizations: UserInvites[];
}

export const useGetUserInvites = () => {
	const { data, isLoading, isError, error } = useQuery<UserInvitesResponse, ErrorResponse>(
		ApiService.getUserInvites,
		{
			refetchOnWindowFocus: true
			// withCredentials: true
		}
	);

	const organizations: UserInvites[] = data?.organizations || [];

	return {
		data: organizations,
		isLoading,
		isError,
		error
	};
};
