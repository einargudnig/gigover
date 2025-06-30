import {
	Box,
	Button,
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
import { useGetOrganizations } from '../../queries/organisations/useGetOrganizations';
import { useGetUserInfo } from '../../queries/useGetUserInfo';

export function SettingsLayout() {
	const { data, isPending, isFetching } = useGetOrganizations();
	const { data: userInfo, isPending: userIsPending } = useGetUserInfo();
	console.log(data);

	const currentOrganization = userInfo?.organization;

	return (
		<>
			<Box>
				<Text fontWeight="bold" color={'gray.700'}>
					Organization
				</Text>
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
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>{currentOrganization?.name}</Td>
										<Td>{currentOrganization?.priv}</Td>
										<Td>
											<Button colorScheme={'yellow'}>Manage</Button>
										</Td>
									</Tr>
									{data?.map((org) => (
										<Tr key={org.id}>
											<Td>{org.name}</Td>
											<Td>{org.priv}</Td>
											<Td>
												<Button colorScheme={'yellow'}>Manage</Button>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</>
				)}
			</Box>
		</>
	);
}
