import React from 'react';
import { Table, Tbody, Thead, Tr, Th, Tooltip } from '@chakra-ui/react';

export const PublishedTender = (): JSX.Element => {
	return (
		<>
			<Table>
				<Thead>
					<Tr>
						<Tooltip label="Product number">
							<Th>Number</Th>
						</Tooltip>

						<Tooltip label="Description of the items">
							<Th>Description</Th>
						</Tooltip>

						<Tooltip label="Volume, how many items">
							<Th>Volume</Th>
						</Tooltip>

						<Tooltip label="The measurement of unit for items">
							<Th>Unit</Th>
						</Tooltip>

						<Tooltip label="Cost for items">
							<Th>Cost</Th>
						</Tooltip>

						<Tooltip label="Notes or certifications for the items.">
							<Th>Notes/Certifications</Th>
						</Tooltip>
					</Tr>
				</Thead>
			</Table>
		</>
	);
};
