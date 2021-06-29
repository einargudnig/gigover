import React, { useCallback, useEffect, useState } from 'react';
import { useInviteUserToProject } from '../../mutations/useInviteUserToProject';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { devError, devInfo } from '../../utils/ConsoleUtils';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react';
import { Theme } from '../../Theme';
import { useProjectUsers } from '../../queries/useProjectUsers';

export interface InviteUserProps {
	projectId: number;
}

export const InviteUser = ({ projectId }: InviteUserProps): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [inviteSuccess, setInviteSuccess] = useState(false);
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
				inviteMutation.mutateAsync({ uId: response.uId, projectId }).then((res) => {
					if (res.errorCode === 'OK') {
						setSearchMail('');
						setInviteSuccess(true);
					} else {
						throw new Error('Could not invite user.');
					}
				});
			}
		} catch (e) {
			//
			devError(e);
		}
	}, [searchMutation, searchMail]);

	useEffect(() => {
		if (inviteSuccess) {
			setTimeout(() => {
				setInviteSuccess(false);
			}, 3500);
		}
	}, [inviteSuccess]);

	return (
		<>
			<FormControl
				isRequired={true}
				isInvalid={searchMutation.isError || inviteMutation.isError}
				mb={4}
			>
				<FormLabel htmlFor={'inviteEmail'}>E-mail</FormLabel>
				<Input
					placeholder={'Enter e-mail address of a Gigover user'}
					name={'inviteEmail'}
					value={searchMail}
					onChange={(e) => setSearchMail(e.target.value)}
				/>
				{inviteSuccess ? (
					<>
						<Text mt={4} color={Theme.colors.green}>
							User has been invited to the project
						</Text>
					</>
				) : (
					(searchMutation.isError || inviteMutation.isError) && (
						<FormErrorMessage>
							The user with email {searchMail} could not be found or has already been
							invited.
						</FormErrorMessage>
					)
				)}
			</FormControl>
			<Button
				loadingText={'Inviting'}
				isLoading={searchMutation.isLoading || inviteMutation.isLoading}
				disabled={searchMutation.isLoading || inviteMutation.isLoading}
				onClick={search}
			>
				Invite
			</Button>
		</>
	);
};
