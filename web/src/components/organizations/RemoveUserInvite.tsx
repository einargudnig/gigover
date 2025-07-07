import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useRemoveInviteToOrganization } from '../../mutations/organizations/useRemoveInviteToOrganization';
import { useGetUserByEmail } from '../../queries/useGetUserByEmail';

export function RemoveUserInvite() {
	const [searchMail, setSearchMail] = useState('');
	const [searchSuccess, setSearchSuccess] = useState(false);
	const [userId, setUserId] = useState<string | undefined>();
	const [mutationSuccess, setMutationSuccess] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const removeInviteMutation = useRemoveInviteToOrganization();
	const searchMutation = useGetUserByEmail();

	const toast = useToast();
	const search = useCallback(async () => {
		try {
			const response = await searchMutation.mutateAsync({
				email: searchMail
			});

			if (response.uId) {
				console.log('Found user with uId:', response.uId);

				setUserId(response.uId);
				setSearchSuccess(true);
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

	const removeUserInvite = useCallback(async () => {
		try {
			const response = await removeInviteMutation.mutateAsync({
				uId: userId!
			});

			if (response.errorCode === 'OK') {
				setMutationSuccess(true);
			} else {
				throw new Error('Could not remove user invite.');
			}
		} catch (e) {
			throw new Error('Could not remove user invite.');
		}
	}, [removeInviteMutation, userId]);

	return (
		<>
			<Button onClick={onOpen} variant={'ghost'} colorScheme="gray">
				Remove user invite
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent pb={4}>
					<ModalHeader>Remove user invite</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl
							isRequired={true}
							isInvalid={searchMutation.isError || removeInviteMutation.isError}
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

							{!mutationSuccess ? (
								<>
									{searchSuccess ? (
										<>
											<Flex mb={3}>
												<Text>✅ Found user with email: {searchMail}</Text>
											</Flex>

											<Button
												isLoading={removeInviteMutation.isPending}
												disabled={removeInviteMutation.isPending}
												onClick={removeUserInvite}
												width={'full'}
												variant={'outline'}
												colorScheme={'gray'}
											>
												Remove user invite
											</Button>
										</>
									) : (
										<Button
											loadingText={'Searching...'}
											isLoading={searchMutation.isPending}
											disabled={searchMutation.isPending}
											onClick={search}
											width={'full'}
											variant={'outline'}
											colorScheme={'gray'}
										>
											Search for user
										</Button>
									)}
								</>
							) : (
								<Box>
									<Text>Successfully removed the invite to the organization</Text>
								</Box>
							)}
						</FormControl>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
