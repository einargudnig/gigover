import { useGetUserInfo } from '../queries/useGetUserInfo';

export const useGetUserPrivileges = () => {
	const { data } = useGetUserInfo();
	const privileges = data?.organization.priv;

	return {
		privileges
	};
};
