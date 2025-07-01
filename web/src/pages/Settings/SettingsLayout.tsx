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
	Text,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { ManageOrganizationInvites } from '../../components/organizations/ManageOrganizationInvites';
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';
import { OrgInfo } from './OrgInfo';

export function SettingsLayout() {
	const { data, isPending, isFetching } = useGetOrganizations();
	const { data: userInfo, isPending: userIsPending } = useGetUserInfo();
	console.log(data);
	console.log(userInfo);

	const currentOrganization = userInfo?.organization;
	console.log(currentOrganization);
	const isPersonalSpace = currentOrganization === undefined;

	const privMap = {
		ADMIN: '(Admin)',
		EDITOR: '(Editor)',
		VIEWER: '(Viewer)'
	}[userInfo?.organization?.priv];

	// const currentOrganizationPriv = privMap[currentOrganization?.priv];

	return (
		<>
			<Box>
				<Text fontWeight="bold" color={'gray.700'}>
					Organization
				</Text>

				<Box mt={4}>
					<Flex justifyContent={'space-around'} alignItems={'center'}>
						<OrgInfo />
						<ManageOrganizationInvites />
					</Flex>
				</Box>
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
										// const isCurrentOrganization = org.id === currentOrganization?.id;
										// const isCurrentOrganizationPriv = privMap[org.priv];
										// const isAdmin = org.priv === 'A';
										const isAdmin = false;

										return (
											<Tr key={org.id}>
												<Td>{org.name}</Td>
												<Td>{org.priv}</Td>
												<Td>
													<HStack>
														<Button
															isDisabled={isAdmin}
															variant={'outline'}
															colorScheme={'gray'}
														>
															Manage
														</Button>

														<IconButton
															isDisabled={isAdmin}
															variant={'outline'}
															colorScheme={'red'}
															aria-label="Delete organization"
														>
															<TrashIcon color={'red'} />
														</IconButton>
														<IconButton
															isDisabled={isAdmin}
															variant={'outline'}
															colorScheme={'gray'}
															aria-label="Leave organization"
														>
															<ExternalLinkIcon color={'black'} />
														</IconButton>
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
		</>
	);
}
