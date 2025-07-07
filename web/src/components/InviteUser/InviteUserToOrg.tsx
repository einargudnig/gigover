import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Text,
	useToast
} from '@chakra-ui/react';
import emailjs from '@emailjs/browser';
import { useCallback, useState } from 'react';
import { useInviteUserToOrganization } from '../../mutations/organizations/useInviteUserToOrganization';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';

interface InviteUserToOrgProps {
	organizationName: string;
	onClose: () => void;
}

export const InviteUserToOrg = ({
	organizationName,
	onClose
}: InviteUserToOrgProps): JSX.Element => {
	const [searchMail, setSearchMail] = useState('');
	const [userId, setUserId] = useState<string | undefined>();
	const [selectedPrivileges, setSelectedPrivileges] = useState<'A' | 'E' | 'V' | undefined>();
	const [inviteSuccess, setInviteSuccess] = useState(false);
	const [mutationSuccess, setMutationSuccess] = useState(false);
	const [mutationError, setMutationError] = useState<string | null>(null);
	const [searchError, setSearchError] = useState<string | null>(null);
	const inviteMutation = useInviteUserToOrganization();
	const searchMutation = useGetUserByEmail();

	const extraInfoMap = {
		A: 'Admin can see all projects, manage all users',
		E: 'Editor can see projects they are added to, create new projects, edit tasks and members within those projects.',
		V: 'Viewer see projects they are added to, action tasks they are assigned to, cannot create projects or tasks.'
	};

	const extraInfo = selectedPrivileges
		? extraInfoMap[selectedPrivileges]
		: 'Select a privilege level to see more information';

	const toast = useToast();
	const search = useCallback(async () => {
		try {
			setSearchError(null);
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				console.log('Found user with uId:', response.uId);

				setSearchError(null);
				setInviteSuccess(true);
				setUserId(response.uId);
				setMutationError(null);
			} else {
				// TODO I need to add this!
				toast({
					title: 'User not found!',
					description: 'The user was not found, We have sent an email to the user.',
					status: 'error',
					duration: 5000,
					isClosable: true
				});
				sendEmailNoAccount(searchMail);
			}
		} catch (e) {
			console.error(e);
			setMutationError(null);
			setSearchError('Error searching for user');
			throw new Error('Could not invite user.');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchMutation, searchMail]);

	// For the email we send if the user does not have a gigOver account.
	const sendEmailNoAccount = async (email: string) => {
		const emailServiceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
		const emailUserId = 'yz_BqW8_gSHEh6eAL'; // this is a public key, so no reason to have it in .env
		const emailTemplateId = import.meta.env.VITE_EMAIL_ORGANIZATION_INVITE_TEMPLATE_ID;
		const templateParams = {
			organization_name: organizationName,
			to_email: email
		};
		console.log('Sending email to: ', email);
		console.log('propertyName: ', templateParams.organization_name);
		try {
			await emailjs
				.send(emailServiceId!, emailTemplateId!, templateParams!, emailUserId!)
				.then(
					function (response) {
						console.log('SUCCESS!', response.status, response.text);
					},
					function (error) {
						console.log('FAILED...', error);
					}
				);
		} catch (e) {
			console.log(e);
		}
	};

	const addMemberToOrganization = useCallback(async () => {
		try {
			setMutationError(null);

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
				setTimeout(() => {
					onClose();
				}, 1500);
			} else {
				setMutationError(response.errorCode);
				throw new Error('Could not invite user.');
			}
		} catch (e) {
			console.error(e);
			setMutationError('Error inviting user');
			setSearchMail('');
			setInviteSuccess(false);
			setSelectedPrivileges(undefined);
			throw new Error('Could not invite user.');
		}
	}, [inviteMutation, onClose, searchMail, selectedPrivileges, userId]);

	return (
		<>
			<FormControl isInvalid={searchMutation.isError} mb={4}>
				<FormLabel htmlFor={'inviteEmail'}>E-mail</FormLabel>
				<Input
					placeholder={'Enter e-mail address of a Gigover user'}
					type="email"
					value={searchMail}
					onChange={(e) => setSearchMail(e.target.value)}
					marginBottom={4}
				/>

				{searchError ? (
					<Flex justifyContent={'center'} alignItems={'center'} mt={3}>
						<Text color={'red.400'} fontWeight={'semibold'}>
							{searchError}
						</Text>
					</Flex>
				) : null}

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
					<Box>
						<Text mt={2} align={'center'}>
							{extraInfo}
						</Text>
						<Button
							isLoading={inviteMutation.isPending}
							disabled={inviteMutation.isPending}
							onClick={addMemberToOrganization}
							width={'full'}
							variant={'outline'}
							colorScheme={'gray'}
							mt={3}
							_hover={{ bg: 'gray.300' }}
						>
							Invite user to organization
						</Button>
					</Box>
				)}
				{mutationSuccess ? (
					<Flex justifyContent={'center'} alignItems={'center'} mt={3}>
						<Text color={'green.500'}>User invited to organization</Text>
					</Flex>
				) : null}
				{mutationError ? (
					<Flex justifyContent={'center'} alignItems={'center'} mt={3}>
						<Text color={'red.400'} fontWeight={'semibold'}>
							{mutationError}
						</Text>
					</Flex>
				) : null}
			</FormControl>
			<Flex justifyContent={'flex-end'}>
				{!inviteSuccess ? (
					<Button
						loadingText={'Searching...'}
						isLoading={searchMutation.isPending || inviteMutation.isPending}
						disabled={searchMutation.isPending || inviteMutation.isPending}
						onClick={search}
						width={'full'}
						variant={'outline'}
						colorScheme={'gray'}
					>
						Search for user
					</Button>
				) : null}
			</Flex>
		</>
	);
};
