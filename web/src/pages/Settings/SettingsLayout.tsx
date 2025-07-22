import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
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
	Tr
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ManageOrganizationInvites } from '../../components/organizations/ManageOrganizationInvites';
import { OrganizationSwitcher } from '../../components/organizations/OrganizationSwitcher';
import { Organization } from '../../models/Organizations';
import { useChangeOrganizations } from '../../mutations/organizations/useChangeOrganizations';
import { useDeleteOrganization } from '../../mutations/organizations/useDeleteOrganization';
import { useLeaveOrganization } from '../../mutations/organizations/useLeaveOrganization';
import { useLoginOrg } from '../../mutations/organizations/useLoginOrg';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { OrgInfo } from './OrgInfo';
import { ManageOrganization } from '../../components/organizations/ManageOrganization';
import { MemberTable } from '../Organisation/MemberTable';

export function SettingsLayout() {
	const { data, isPending, isFetching } = useGetOrganizations();
	const { data: userInfo } = useGetUserInfo();
	const [showOrgs, setShowOrgs] = useState(false);
	const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const [isManageModalOpen, setIsManageModalOpen] = useState(false);
	const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
	const [loginError, setLoginError] = useState<string | null>(null);

	const currentOrganization = userInfo?.organization;
	const isPersonalSpace = currentOrganization === undefined;

	const leaveOrganizationMutation = useLeaveOrganization();
	const deleteOrganizationMutation = useDeleteOrganization();
	const changeOrganizationMutation = useChangeOrganizations();

	const { mutateAsync: loginOrg, isPending: loginPending } = useLoginOrg();
	const { register, handleSubmit, reset } = useForm<{ password: string }>({
		defaultValues: { password: '' }
	});

	const handleOpenManage = (org) => {
		setSelectedOrg(org);
		setIsManageModalOpen(true);
		setLoginError(null);
		reset();
	};

	const handleCloseManage = () => {
		setIsManageModalOpen(false);
		setSelectedOrg(null);
		setLoginError(null);
		reset();
	};

	const handleLogin = async (password: string) => {
		if (!selectedOrg) return;
		try {
			setLoginError(null);
			const response = await loginOrg({ name: selectedOrg.name, password });
			if (response.errorCode === 'OK') {
				setShowOrgs(true);
				// handleCloseManage();
			} else if (response.errorCode === 'WRONG_USER_PASSWORD') {
				setLoginError('Wrong password');
			}
		} catch (error) {
			setLoginError('Invalid username or password, try again');
		}
	};

	return (
		<>
			<Box>
				{isPending || isFetching ? (
					<Flex justifyContent={'center'} alignItems={'center'} h={'100%'}>
						<LoadingSpinner />
					</Flex>
				) : (
					<>
						<TableContainer>
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th>Organization</Th>
										<Th>Role</Th>
										<Th>Actions</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>
											{isPersonalSpace
												? 'Active organization: Personal space'
												: `Active organization: ${currentOrganization?.name}`}
										</Td>
										<Td>
											{isPersonalSpace ? 'Owner' : currentOrganization?.priv}
										</Td>
										<Td>
											{!isPersonalSpace ? (
												<HStack>
													<Button
														variant="outline"
														colorScheme="gray"
														onClick={() =>
															handleOpenManage(currentOrganization)
														}
													>
														<Link
															to={`/settings/${currentOrganization?.id}`}
														>
															Manage
														</Link>
													</Button>
													<ConfirmDialog
														header="Leave organization"
														callback={async (b) => {
															if (b) {
																await leaveOrganizationMutation.mutateAsync(
																	currentOrganization?.id
																);
																await changeOrganizationMutation.mutateAsync(
																	{ id: 0 }
																);
															}
															setLeaveDialogOpen(false);
														}}
														isOpen={leaveDialogOpen}
														setIsOpen={setLeaveDialogOpen}
														confirmButtonText="Leave"
													>
														<Tooltip label={'Leave organization'}>
															<IconButton
																variant={'outline'}
																colorScheme={'gray'}
																onClick={() =>
																	setLeaveDialogOpen(true)
																}
																aria-label="Leave organization"
															>
																<ExternalLinkIcon color={'black'} />
															</IconButton>
														</Tooltip>
													</ConfirmDialog>

													<ConfirmDialog
														header="Delete organization"
														callback={async (b) => {
															if (b) {
																await deleteOrganizationMutation.mutateAsync(
																	currentOrganization?.id
																);
																await changeOrganizationMutation.mutateAsync(
																	{ id: 0 }
																);
															}
															setDeleteDialogOpen(false);
														}}
														isOpen={deleteDialogOpen}
														setIsOpen={setDeleteDialogOpen}
														confirmButtonText="Delete"
													>
														<Tooltip label={'Delete organization'}>
															<IconButton
																variant={'outline'}
																colorScheme={'red'}
																onClick={() =>
																	setDeleteDialogOpen(true)
																}
																aria-label="Delete organization"
															>
																<TrashIcon color={'red'} />
															</IconButton>
														</Tooltip>
													</ConfirmDialog>
												</HStack>
											) : null}
										</Td>
									</Tr>
									{data?.map((org) => {
										const isCurrentOrg = org.id === currentOrganization?.id;

										return (
											<Tr key={org.id}>
												<Td>{org.name}</Td>
												<Td>{org.priv}</Td>
												<Td>
													<HStack>
														<Button
															variant="outline"
															colorScheme="gray"
															disabled={!isCurrentOrg}
															// onClick={() => handleOpenManage(org)}
														>
															<Link to={`/settings/${org.id}`}>
																Manage
															</Link>
														</Button>

														<ConfirmDialog
															header="Leave organization"
															callback={async (b) => {
																if (b) {
																	await leaveOrganizationMutation.mutateAsync(
																		org.id
																	);
																	await changeOrganizationMutation.mutateAsync(
																		{ id: 0 }
																	);
																}
																setLeaveDialogOpen(false);
															}}
															isOpen={leaveDialogOpen}
															setIsOpen={setLeaveDialogOpen}
															confirmButtonText="Leave"
														>
															<Tooltip
																label={
																	isCurrentOrg
																		? 'Leave organization'
																		: 'Select this organization to leave'
																}
															>
																<IconButton
																	isDisabled={!isCurrentOrg}
																	variant={'outline'}
																	colorScheme={'gray'}
																	onClick={() =>
																		setLeaveDialogOpen(true)
																	}
																	aria-label="Leave organization"
																>
																	<ExternalLinkIcon
																		color={'black'}
																	/>
																</IconButton>
															</Tooltip>
														</ConfirmDialog>

														<ConfirmDialog
															header="Delete organization"
															callback={async (b) => {
																if (b) {
																	await deleteOrganizationMutation.mutateAsync(
																		org.id
																	);
																	await changeOrganizationMutation.mutateAsync(
																		{ id: 0 }
																	);
																}
																setDeleteDialogOpen(false);
															}}
															isOpen={deleteDialogOpen}
															setIsOpen={setDeleteDialogOpen}
															confirmButtonText="Delete"
														>
															<Tooltip
																label={
																	isCurrentOrg
																		? 'Delete organization'
																		: 'Select this organization to delete'
																}
															>
																<IconButton
																	isDisabled={!isCurrentOrg}
																	variant={'outline'}
																	colorScheme={'red'}
																	onClick={() =>
																		setDeleteDialogOpen(true)
																	}
																	aria-label="Delete organization"
																>
																	<TrashIcon color={'red'} />
																</IconButton>
															</Tooltip>
														</ConfirmDialog>
													</HStack>
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						</TableContainer>
					</>
				)}
			</Box>

			{/* Manage Organization Modal */}
			<Modal isOpen={isManageModalOpen} onClose={handleCloseManage} size={'lg'}>
				<ModalOverlay />
				<ModalContent p={2}>
					<ModalCloseButton />
					<ModalBody>
						{selectedOrg &&
						currentOrganization &&
						selectedOrg.id === currentOrganization.id ? (
							<>
								{showOrgs ? (
									<MemberTable activeOrg={selectedOrg} />
								) : (
									<Box mt={4} w={'100%'}>
										<Heading size="md">Log in to Organization</Heading>
										<Box mt={2}>
											<form
												onSubmit={handleSubmit(
													(data) =>
														selectedOrg && handleLogin(data.password)
												)}
											>
												<FormControl marginBottom={2}>
													<FormLabel htmlFor="name">
														Active organization Name
													</FormLabel>
													<Input
														type="text"
														id="name"
														value={selectedOrg.name}
														isDisabled
													/>
												</FormControl>
												<FormControl marginBottom={2}>
													<FormLabel htmlFor="password">
														Password
													</FormLabel>
													<Input
														type="password"
														id="password"
														{...register('password')}
													/>
												</FormControl>
												<Flex marginTop={4} marginBottom={3}>
													<Box>
														<Button
															variant={'outline'}
															colorScheme="gray"
															onClick={handleCloseManage}
														>
															Cancel
														</Button>
													</Box>
													<Spacer />
													<Box>
														<Button
															type="submit"
															colorScheme="gray"
															isLoading={loginPending}
														>
															Login
														</Button>
													</Box>
												</Flex>
												{loginError && (
													<Flex
														justifyContent={'center'}
														alignItems={'center'}
														mt={3}
													>
														<Text
															color={'red.400'}
															fontWeight={'semibold'}
														>
															{loginError}
														</Text>
													</Flex>
												)}
											</form>
										</Box>
									</Box>
								)}
							</>
						) : selectedOrg ? (
							<Box>
								<Flex justifyContent={'center'} alignItems={'center'} mt={10}>
									<Flex flexDirection={'column'} alignItems={'center'}>
										<Text
											fontSize={'xl'}
											fontWeight={'semibold'}
											textColor={'gray.800'}
										>
											You need to select the correct organization before
											managing it!
										</Text>
										<Box mt={4}>
											<HStack>
												<Text textColor={'gray.600'}>
													Select organization:{' '}
												</Text>
												<OrganizationSwitcher />
											</HStack>
										</Box>
									</Flex>
								</Flex>
							</Box>
						) : null}
					</ModalBody>
				</ModalContent>
			</Modal>

			<Box mt={8} mb={4}>
				<Flex justifyContent={'space-around'} alignItems={'flex-start'}>
					<OrgInfo />
					<ManageOrganizationInvites />
					{/* <ManageOrganization /> */}
				</Flex>
			</Box>
		</>
	);
}
