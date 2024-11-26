import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { InviteUserToOrg } from '../../components/InviteUser/InviteUserToOrg';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { VerticalDots } from '../../components/icons/VerticalDots';
import { OrganizationSwitcher } from '../../components/organizations/OrganizationSwitcher';
import { useChangePrivileges } from '../../mutations/organizations/useChangePrivileges';
import { useRemoveInviteToOrganization } from '../../mutations/organizations/useRemoveInviteToOrganization';
import { useGetOrganizationUsers } from '../../queries/organisations/useGetOrganizationUsers';
import { useGetUserOrgInvites } from '../../queries/organisations/useGetUserOrgInvites';
import { InfoIcon } from '@chakra-ui/icons';

export function MemberTable({ activeOrg }): JSX.Element {
	const { data, isLoading, isFetching, isError, error } = useGetOrganizationUsers();
	const changePrivileges = useChangePrivileges();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const {
		data: userInvites,
		isLoading: userInvitesLoading,
		isFetching: userInvitesFetching,
		isError: userInvitesIsError,
		error: userInvitesError
	} = useGetUserOrgInvites();
	const removeInviteMutation = useRemoveInviteToOrganization();

	const updatePrivileges = ({ uId, priv }) => {
		setUpdatingUserId(uId);
		console.log('Update the user with the userId:', { uId }, 'and his privileges to be: ', {
			priv
		});
		changePrivileges.mutate(
			{
				uId,
				priv
			},
			{
				onSettled: () => {
					setUpdatingUserId(null);
				}
			}
		);
	};

	const removeUserInvite = useCallback(
		async (userId) => {
			try {
				const response = await removeInviteMutation.mutateAsync({
					uId: userId!
				});

				if (response.errorCode === 'OK') {
					console.log('User invite removed.');
				} else {
					throw new Error('Could not remove user invite.');
				}
			} catch (e) {
				throw new Error('Could not remove user invite.');
			}
		},
		[removeInviteMutation]
	);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent pb={4}>
					<ModalHeader>Invite members to {activeOrg.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<InviteUserToOrg organizationName={activeOrg.name} onClose={onClose} />
					</ModalBody>
				</ModalContent>
			</Modal>

			{activeOrg ? (
				<>
					<Box width="full">
						<Box>
							<Flex alignItems={'center'}>
								<Heading size={'md'}>
									Member Table - {activeOrg?.name ?? ''}
								</Heading>
								<Spacer />
								<Box>
									<Flex>
										<Button
											variant={'outline'}
											colorScheme={'gray'}
											onClick={onOpen}
										>
											Invite Members
										</Button>
									</Flex>
								</Box>
							</Flex>
						</Box>

						<TableContainer>
							<Table variant="striped">
								<Thead>
									<Tr>
										<Th>Name</Th>
										<Th>Email</Th>
										<Th>Access</Th>
										<Th>Status</Th>
										<Th>Actions</Th>
									</Tr>
								</Thead>
								<Tbody>
									{data?.organizationUsers.map((member) => (
										<Tr key={member.uId}>
											<Td>
												<Flex alignItems={'center'}>
													<Avatar
														size="sm"
														name={member.name}
														src={`https://bit.ly/${member.name}`}
													/>
													<Text marginLeft={1} color="black">
														{member.name}
													</Text>
												</Flex>
											</Td>
											<Td>{member.email}</Td>
											<Td width={'65px'}>{member.priv}</Td>
											<Td>Joined</Td>
											<Td>
												<Menu>
													<MenuButton>
														{updatingUserId === member.uId ? (
															<LoadingSpinner />
														) : (
															<VerticalDots />
														)}
													</MenuButton>
													<MenuList>
														<MenuItem
															onClick={() =>
																updatePrivileges({
																	uId: member.uId,
																	priv: 'ADMIN'
																})
															}
														>
															<Flex align={'center'}>
																Make admin
																<Tooltip label="Manages organizations. See all projects and manage users.">
																	<InfoIcon ml={2} />
																</Tooltip>
															</Flex>
														</MenuItem>
														<MenuItem
															onClick={() =>
																updatePrivileges({
																	uId: member.uId,
																	priv: 'EDITOR'
																})
															}
														>
															<Flex align={'center'}>
																Make editor
																<Tooltip label="See projects they are added to, create new projects, edit tasks and members within those tasks.">
																	<InfoIcon ml={2} />
																</Tooltip>
															</Flex>
														</MenuItem>
														<MenuItem
															onClick={() =>
																updatePrivileges({
																	uId: member.uId,
																	priv: 'VIEWER'
																})
															}
														>
															<Flex align={'center'}>
																Make viewer
																<Tooltip label="See projects they are added to, action tasks they are assigned to.">
																	<InfoIcon ml={2} />
																</Tooltip>
															</Flex>
														</MenuItem>
													</MenuList>
												</Menu>
											</Td>
										</Tr>
									))}

									{userInvitesLoading || userInvitesFetching ? (
										<Tr>
											<Td></Td>
										</Tr>
									) : userInvitesIsError ? (
										<Tr>
											<Td>{userInvitesError?.errorCode}</Td>
										</Tr>
									) : (
										<>
											{userInvites?.map((invite, index) => (
												<Tr key={index}>
													<Td>
														<Flex alignItems={'center'}>
															<Avatar
																size="sm"
																name={invite.name}
																src={`https://bit.ly/${invite.name}`}
															/>
															<Text marginLeft={1} color="black">
																{invite.name}
															</Text>
														</Flex>
													</Td>
													<Td>{invite.email}</Td>
													<Td>{invite.priv}</Td>
													<Td>Invited</Td>
													<Td>
														<Menu>
															<MenuButton>
																<VerticalDots />
															</MenuButton>
															<MenuList>
																<MenuItem
																	onClick={() =>
																		removeUserInvite({
																			uId: invite.uId
																		})
																	}
																>
																	Remove invite
																</MenuItem>
															</MenuList>
														</Menu>
													</Td>
												</Tr>
											))}
										</>
									)}

									{isLoading || isFetching ? (
										<Tr>
											<Td>Loading...</Td>
											<Td>
												<LoadingSpinner />
											</Td>
										</Tr>
									) : isError ? (
										<Tr>
											<Td>{error?.errorCode}</Td>
										</Tr>
									) : (
										<>
											{data?.organizationUsers.length === 0 ? (
												<>
													<Tr>
														<Td>
															No data, be sure that you have selected
															a organization!
														</Td>
													</Tr>
													<Tr>
														<Td>
															You might be in your personal space.
														</Td>
													</Tr>
												</>
											) : null}
										</>
									)}
								</Tbody>
							</Table>
						</TableContainer>
						<Box mt={4}>
							<Flex>
								{changePrivileges.isError && (
									<Text color={'red.500'}>{changePrivileges.error?.message}</Text>
								)}
							</Flex>
						</Box>
					</Box>
				</>
			) : (
				<>
					<Flex justifyContent={'center'} alignItems={'center'} mt={10}>
						<Flex flexDirection={'column'} alignItems={'center'}>
							<Text fontSize={'xl'} fontWeight={'semibold'} textColor={'gray.800'}>
								You need to select an organization before logging in!
							</Text>
							<Box mt={4}>
								<HStack>
									<Text textColor={'gray.600'}>Select organization: </Text>
									<OrganizationSwitcher />
								</HStack>
							</Box>
						</Flex>
					</Flex>
				</>
			)}
		</>
	);
}
