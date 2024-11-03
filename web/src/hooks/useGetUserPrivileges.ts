import { useGetUserInfo } from '../queries/useGetUserInfo';

export const useGetUserPrivileges = () => {
	const { data } = useGetUserInfo();
	// Make sure to handle the case where there is no active organization
	if (!data?.organization) {
		return {
			privileges: '',
			activeOrg: false
		};
	}

	const activePrivileges = data?.organization.priv;

	return {
		privileges: activePrivileges,
		activeOrg: true
	};
};
