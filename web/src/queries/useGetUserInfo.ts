import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { IUserInfo } from '../models/UserProfile';
import { ApiService } from '../services/ApiService';

export const useGetUserInfo = () => {
	// This might be overkill. I only do this when registered and logged in, so this default user should never be used.
	const defaultUserInfo: IUserInfo = {
		userName: '',
		name: '',
		registered: false,
		type: 0,
		address: '',
		zipCode: '',
		avatar: '',
		phoneNumber: '',
		userId: '',
		email: '',
		organizations: [],
		organization: {
			id: 0,
			name: '',
			priv: 'A'
		},
		authenticated: false
	};

	const { data, isLoading, isError, error } = useQuery<IUserInfo, ErrorResponse>({
		queryKey: [ApiService.getUserInfo]
	});

	const userInfo: IUserInfo = data || defaultUserInfo;

	return {
		data: userInfo,
		isLoading,
		isError,
		error
	};
};
