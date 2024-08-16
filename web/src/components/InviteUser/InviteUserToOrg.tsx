import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Text,
	useToast
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useInviteUserToOrganization } from '../../mutations/organizations/useInviteUserToOrganization';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';
import { FormActions } from '../FormActions';

export const InviteUserToOrg = (): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [userId, setUserId] = useState<string | undefined>();
	const [selectedPrivileges, setSelectedPrivileges] = useState<'A' | 'E' | 'V' | undefined>();
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const [mutationSuccess, setMutationSuccess] = useState(false);
	const inviteMutation = useInviteUserToOrganization();
	const searchMutation = useGetUserByEmail();

	const toast = useToast();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				console.log('Found user with uId:', response.uId);

				setInviteSuccess(true);
				setUserId(response.uId);
			} else {
				// TODO I need to add this!
				toast({
					title: 'User not found!',
					description: 'The user was not found, We have sent an email to the user.',
					status: 'error',
					duration: 5000,
					isClosable: true
				});
			}
		} catch (e) {
			console.error(e);
			throw new Error('Could not invite user.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	const addMemberToOrganization = useCallback(async () => {
		try {
			const response = await inviteMutation.mutateAsync({
				email: searchMail ?? '', // email of the user to invite -> searchMail
				uId: userId!, // we know this is defined, we will never get here if it is not! // TODO maybe I can remove this
				priv: selectedPrivileges!
			});

			// errorCode === "OK" means that the user was invited successfully
			if (response.errorCode === 'OK') {
				setSearchMail('');
				setInviteSuccess(true);
				setMutationSuccess(true);
			} else {
				throw new Error('Could not invite user.');
			}
		} catch (e) {
			console.error(e);
			throw new Error('Could not invite user.');
		}
	}, [inviteMutation, searchMail, selectedPrivileges, userId]);

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
					marginBottom={4}
				/>

				{inviteSuccess ? (
					<>
						<FormLabel htmlFor={'priv'}>Privileges</FormLabel>

						<Select
							placeholder={'Select privileges'}
							value={selectedPrivileges}
							onChange={(e) =>
								setSelectedPrivileges(e.target.value as 'A' | 'E' | 'V')
							}
						>
							<option value="A">Admin</option>
							<option value="E">Editor</option>
							<option value="V">Viewer</option>
						</Select>
					</>
				) : null}

				{selectedPrivileges && (
					<FormActions
						submitText={'Add member to organization'}
						onSubmit={addMemberToOrganization}
						submitLoading={inviteMutation.isLoading}
					/>
				)}
				{mutationSuccess ? (
					<Flex justifyContent={'center'} alignItems={'center'}>
						<Text color={'green.500'}>Member added to organization</Text>
					</Flex>
				) : null}
			</FormControl>
			<Flex justifyContent={'flex-end'}>
				{!inviteSuccess ? (
					<Button
						loadingText={'Inviting'}
						isLoading={searchMutation.isLoading || inviteMutation.isLoading}
						disabled={searchMutation.isLoading || inviteMutation.isLoading}
						onClick={search}
					>
						Search for user
					</Button>
				) : null}
			</Flex>
		</>
	);
};
