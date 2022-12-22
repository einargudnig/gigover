import React from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableContainer,
	Editable,
	EditableInput,
	EditablePreview
} from '@chakra-ui/react';

export const TenderTable = ({ tender }): JSX.Element => {
	return (
		<>
			<TableContainer>
				<Table variant="striped" colorScheme="yellow">
					<Thead>
						<Tr>
							<Th>Description</Th>
							<Th>Number</Th>
							<Th>Volume</Th>
							<Th>unit</Th>
						</Tr>
					</Thead>
					<Tbody>
						{tender.map((item) => {
							return (
								<>
									<Tr>
										<Td>
											<Editable defaultValue={item.description}>
												<EditablePreview />
												<EditableInput width={'60'} />
											</Editable>
										</Td>
										<Td>
											<Editable defaultValue={item.nr}>
												<EditablePreview />
												<EditableInput width={'20'} />
											</Editable>
										</Td>
										<Td>
											<Editable defaultValue={item.volume}>
												<EditablePreview />
												<EditableInput width={'24'} />
											</Editable>
										</Td>
										<Td>
											<Editable defaultValue={item.unit}>
												<EditablePreview />
												<EditableInput width={'20'} />
											</Editable>
										</Td>
									</Tr>
								</>
							);
						})}
					</Tbody>
					<Tfoot>
						<Tr>
							<Th>Description</Th>
							<Th>Number</Th>
							<Th>Volume</Th>
							<Th>unit</Th>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
			<div>
				<button>Submit</button>
			</div>
		</>
	);
};
