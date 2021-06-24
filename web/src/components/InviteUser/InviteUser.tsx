import React, { useCallback, useState } from 'react';
import { useInviteUserToProject } from '../../mutations/useInviteUserToProject';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { devError, devInfo } from '../../utils/ConsoleUtils';

export interface InviteUserProps {
	projectId: number;
}

export const InviteUser = ({ projectId }: InviteUserProps): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const inviteMutation = useInviteUserToProject();
	const searchMutation = useGetUserByEmail();

	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				devInfo('Found user with uId:', response.uId);
				// Add to project
				//inviteMutation.mutateAsync({ email, projectId });
			}
		} catch (e) {
			//
			devError(e);
		}
	}, [searchMail, projectId]);

	return (
		<>
			<p>InviteUser {projectId}</p>
		</>
	);
};
