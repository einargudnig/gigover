import { Button, Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInviteUserToOrganization } from '../../mutations/organizations/useInviteUserToOrganization';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { devInfo } from '../../utils/ConsoleUtils';

export const InviteUserToOrg = (): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [privleges, setPrivleges] = useState<'A' | 'E' | 'V'>('E');
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const inviteMutation = useInviteUserToOrganization();
	const searchMutation = useGetUserByEmail();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				devInfo('Found user with uId:', response.uId);
				setInviteSuccess(true);
				// Add to tender
				// 	inviteMutation.mutateAsync({ email, priv }).then((res) => {
				// 		if (res.errorCode === 'OK') {
				// 			setSearchMail('');
				// 			setInviteSuccess(true);
				// 		} else {
				// 			throw new Error('Could not invite user.');
				// 		}
				// 	});
			}
		} catch (e) {
			console.error(e);
			throw new Error('Could not invite user.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	const { register, handleSubmit } = useForm<{ email: string; priv: string }>({
		defaultValues: {
			email: '',
			priv: 'W'
		}
	});

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
					type="email"
					value={searchMail}
					onChange={(e) => setSearchMail(e.target.value)}
				/>

				{inviteSuccess ? (
					<>
						<FormLabel htmlFor={'priv'}>Privleges</FormLabel>
						<Select
							placeholder="Select privleges"
							onChange={(e) => setPrivleges(e.target.value as 'A' | 'E' | 'V')}
						>
							<option value="A">Admin</option>
							<option value="V">Viewer</option>
							<option value="E">Editor</option>
						</Select>
					</>
				) : null}
				{/* {inviteSuccess ? (
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
				)} */}
			</FormControl>
			<Flex justifyContent={'flex-end'}>
				{!inviteSuccess ? (
					<Button
						loadingText={'Inviting'}
						isLoading={searchMutation.isLoading || inviteMutation.isLoading}
						disabled={searchMutation.isLoading || inviteMutation.isLoading}
						onClick={search}
					>
						Invite
					</Button>
				) : null}
			</Flex>
		</>
	);
};
