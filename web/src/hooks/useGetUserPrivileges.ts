import { useGetUserInfo } from '../queries/useGetUserInfo';

export const useGetUserPrivileges = () => {
	const { data } = useGetUserInfo();

	const activeOrganization = data?.organization;

	// Make sure to handle the case where there is no active organization
	if (!activeOrganization) {
		return {
			privileges: '',
			activeOrg: false
		};
	}

	const activeOrgPriv = data.organizations.find((org) => org.id === activeOrganization.id)?.priv;

	return {
		privileges: activeOrgPriv ?? 'W',
		activeOrg: true
	};
};
