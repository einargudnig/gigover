import { InfoIcon } from '@chakra-ui/icons';
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
// import { useGetOr}

export function MemberTable({ activeOrg }): JSX.Element {
	const { data, isPending, isFetching, isError, error } = useGetOrganizationUsers();
	const changePrivileges = useChangePrivileges();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
	const {
		data: userOrgInvites,
		isPending: userInvitesLoading,
		isFetching: userInvitesFetching,
		isError: userInvitesIsError,
		error: userInvitesError
	} = useGetUserOrgInvites();
	console.log({ userOrgInvites });
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

			<Box>
				<Box>
					<Flex alignItems={'center'}>
						<Heading size={'md'}>Member Table - {activeOrg?.name ?? ''}</Heading>
						<Spacer />
						<Box>
							<Flex>
								<Button variant={'outline'} colorScheme={'gray'} onClick={onOpen}>
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
														<Tooltip label="Viewer can view task and communicate within Broadcast communication tasks.">
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
									{userOrgInvites?.map((invite, index) => (
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
														{removeInviteMutation.isPending ? (
															<LoadingSpinner />
														) : (
															<VerticalDots />
														)}
													</MenuButton>
													<MenuList>
														<MenuItem
															onClick={() =>
																removeUserInvite(invite.uId)
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

							{isPending || isFetching ? (
								<Tr>
									<Td></Td>
									<Td></Td>
									<Td>
										<LoadingSpinner />
									</Td>
									<Td></Td>
									<Td></Td>
								</Tr>
							) : isError ? (
								<Tr>
									<Td>{error?.errorText}</Td>
								</Tr>
							) : (
								<>
									{data?.organizationUsers.length === 0 ? (
										<>
											<Tr>
												<Td>
													No data, be sure that you have selected a
													organization!
												</Td>
											</Tr>
											<Tr>
												<Td>You might be in your personal space.</Td>
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
	);
}
