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
	EditablePreview,
	HStack,
	Button,
	Text,
	Box
} from '@chakra-ui/react';

export const TenderTable = ({ tender }): JSX.Element => {
	// we would want to handle this as a useState I suspect
	const updateditem = false;

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
							<Th>Price</Th>
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
										<Td>
											<Editable defaultValue={item.price}>
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
							<Th>Price</Th>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
			{updateditem ? (
				<Box>
					<Text>
						You have updated at least one of the items of the Tender, make sure you Save
						the value
					</Text>
				</Box>
			) : null}
			<Box mt={'4'}>
				<HStack align={'center'} justify={'space-between'}>
					<HStack>
						<Button>Publish Tender</Button>
						<Button>Submit</Button>
					</HStack>
					<HStack>
						<Text fontWeight={'semibold'} fontSize={'lg'}>
							Price total:
						</Text>{' '}
						<Text fontSize={'md'}>2342432</Text>
					</HStack>
				</HStack>
			</Box>
		</>
	);
};
