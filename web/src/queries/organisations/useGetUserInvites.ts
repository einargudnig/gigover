import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../../models/ErrorResponse';
import { UserInvites } from '../../models/Organizations';
import { ApiService } from '../../services/ApiService';

interface UserInvitesResponse {
	organizations: UserInvites[];
}

export const useGetUserInvites = () => {
	const { data, isLoading, isError, error } = useQuery<UserInvitesResponse, ErrorResponse>({
		queryKey: [ApiService.getUserInvites]
	});

	const organizations: UserInvites[] = data?.organizations || [];

	return {
		data: organizations,
		isLoading,
		isError,
		error
	};
};
