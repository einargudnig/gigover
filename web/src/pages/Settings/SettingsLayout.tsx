import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ManageOrganizationInvites } from '../../components/organizations/ManageOrganizationInvites';
import { useChangeOrganizations } from '../../mutations/organizations/useChangeOrganizations';
import { useDeleteOrganization } from '../../mutations/organizations/useDeleteOrganization';
import { useLeaveOrganization } from '../../mutations/organizations/useLeaveOrganization';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { OrgInfo } from './OrgInfo';

export function SettingsLayout() {
	const { data, isPending, isFetching } = useGetOrganizations();
	const { data: userInfo } = useGetUserInfo();

	const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const currentOrganization = userInfo?.organization;
	// TODO: Add privileges to disabled state????
	const isPersonalSpace = currentOrganization === undefined;

	const leaveOrganizationMutation = useLeaveOrganization();
	const deleteOrganizationMutation = useDeleteOrganization();
	const changeOrganizationMutation = useChangeOrganizations();

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
													<Button variant="outline" colorScheme="gray">
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
														<Link to={`/settings/${org.id}`}>
															<Button
																isDisabled={!isCurrentOrg}
																variant="outline"
																colorScheme="gray"
															>
																Manage
															</Button>
														</Link>

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

			<Box mt={8} mb={4}>
				<Flex justifyContent={'space-around'} alignItems={'flex-start'}>
					<OrgInfo />
					<ManageOrganizationInvites />
				</Flex>
			</Box>
		</>
	);
}
