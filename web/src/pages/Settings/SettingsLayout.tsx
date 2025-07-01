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
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { ManageOrganization } from '../../components/organizations/ManageOrganization';
import { ManageOrganizationInvites } from '../../components/organizations/ManageOrganizationInvites';
import { useDeleteOrganization } from '../../mutations/organizations/useDeleteOrganization';
import { useLeaveOrganization } from '../../mutations/organizations/useLeaveOrganization';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { OrgInfo } from './OrgInfo';

export function SettingsLayout() {
	const { data, isPending, isFetching } = useGetOrganizations();
	const { data: userInfo, isPending: userIsPending } = useGetUserInfo();
	const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const currentOrganization = userInfo?.organization;
	console.log(currentOrganization);
	const isPersonalSpace = currentOrganization === undefined;

	const leaveOrganizationMutation = useLeaveOrganization();
	const deleteOrganizationMutation = useDeleteOrganization();

	return (
		<>
			<Box>
				{isPending || isFetching ? (
					<LoadingSpinner />
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
												<Button variant={'outline'} colorScheme={'gray'}>
													Manage
												</Button>
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
														<ManageOrganization orgName={org.name} />

														<ConfirmDialog
															header="Leave organization"
															callback={async (b) => {
																if (b) {
																	leaveOrganizationMutation.mutate(
																		org.id
																	);
																}
																setLeaveDialogOpen(false);
															}}
															isOpen={leaveDialogOpen}
															setIsOpen={setLeaveDialogOpen}
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
																	deleteOrganizationMutation.mutate(
																		org.id
																	);
																}
																setDeleteDialogOpen(false);
															}}
															isOpen={deleteDialogOpen}
															setIsOpen={setDeleteDialogOpen}
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
