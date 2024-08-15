import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
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
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import { InviteUserToOrg } from '../../components/InviteUser/InviteUserToOrg';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { VerticalDots } from '../../components/icons/VerticalDots';
import { useChangePrivileges } from '../../mutations/organizations/useChangePrivileges';
import { useGetOrganizationUsers } from '../../queries/organisations/useGetOrganizationUsers';
import { useGetUserInfo } from '../../queries/useGetUserInfo';

export function MemberTable() {
	const { data, isLoading, isError, error } = useGetOrganizationUsers();
	console.log({ data });
	const { data: userInfo } = useGetUserInfo();
	console.log({ userInfo });
	const changePrivileges = useChangePrivileges();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// const removeUser = (index: number) => {
	// 	const newMembers = [...members];
	// 	newMembers.splice(index, 1);
	// 	console.log({ newMembers });
	// 	setMembers(newMembers);
	// };

	const updatePrivileges = ({ uId, priv }) => {
		changePrivileges.mutate({
			uId,
			priv
		});
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent pb={4}>
					<ModalHeader>Invite Members</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<InviteUserToOrg />
					</ModalBody>
				</ModalContent>
			</Modal>

			<Box width="full">
				<Box>
					<Flex alignItems={'center'}>
						<Heading size={'md'}>Member Table</Heading>
						<Spacer />
						<Box>
							<Button onClick={onOpen}>Invite Members</Button>
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
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{isLoading ? (
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
							{data?.organizationUsers.map((member, index) => (
								<Tr key={index}>
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
									<Td>{member.priv}</Td>
									<Td>
										<Menu>
											<MenuButton>
												{changePrivileges.isLoading ? (
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
													Make admin
												</MenuItem>
												<MenuItem
													onClick={() =>
														updatePrivileges({
															uId: member.uId,
															priv: 'EDITOR'
														})
													}
												>
													Make editor
												</MenuItem>
												<MenuItem
													onClick={() =>
														updatePrivileges({
															uId: member.uId,
															priv: 'VIEWER'
														})
													}
												>
													Make viewer
												</MenuItem>
												<Divider />
												<MenuItem>Remove</MenuItem>
											</MenuList>
										</Menu>
									</Td>
								</Tr>
							))}
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
