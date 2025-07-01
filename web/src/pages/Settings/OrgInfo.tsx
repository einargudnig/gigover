import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

export function OrgInfo() {
	return (
		<Box>
			<Text fontWeight={'bold'} color={'gray.700'}>
				Organization
			</Text>

			<TableContainer>
				<Table>
					<Thead>
						<Tr>
							<Th>Privileges</Th>
							<Th>Description</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td>ADMIN</Td>
							<Td>See all projects and manage users</Td>
						</Tr>
						<Tr>
							<Td>EDITOR</Td>
							<Td>Create new projects, edit tasks and members within those tasks</Td>
						</Tr>
						<Tr>
							<Td>VIEWER</Td>
							<Td>View tasks and communicate</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}
