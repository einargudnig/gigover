import React, { useCallback, useEffect, useState } from 'react';
import { useInviteUserToOrganization } from '../../mutations/organizations/useInviteUserToOrganization';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import {
	Text,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Flex,
	Select
} from '@chakra-ui/react';
import { Theme } from '../../Theme';

export const InviteUserToOrg = (): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [privleges, setPrivleges] = useState<'A' | 'E' | 'V'>('E');
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const inviteMutation = useInviteUserToOrganization();
	const searchMutation = useGetUserByEmail();
	const search = useCallback(async () => {
		try {
			const response = await inviteMutation.mutateAsync({
				email: searchMail,
				priv: privleges
			});

			if (response.errorCode === 'OK') {
				setSearchMail('');
				setInviteSuccess(true);
			}
		} catch (e) {
			console.error(e);
			throw new Error('Could not invite user.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

				<FormLabel htmlFor={'inviteEmail'}>Privleges</FormLabel>
				<Select
					placeholder="Select privleges"
					onChange={(e) => setPrivleges(e.target.value as 'A' | 'E' | 'V')}
				>
					<option value="A">Admin</option>
					<option value="V">Viewer</option>
					<option value="E">Editor</option>
				</Select>

				{inviteSuccess ? (
					<>
						<Text mt={4} color={Theme.colors.green}>
							User has been invited to the organization
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
			<Flex justifyContent={'flex-end'}>
				<Button
					loadingText={'Inviting'}
					isLoading={searchMutation.isLoading || inviteMutation.isLoading}
					disabled={searchMutation.isLoading || inviteMutation.isLoading}
					onClick={search}
				>
					Invite
				</Button>
			</Flex>
		</>
	);
};
