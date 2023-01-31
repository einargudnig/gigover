import React, { useState } from 'react';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableContainer,
	HStack,
	Button,
	Text,
	Box,
	Input,
	Spacer
} from '@chakra-ui/react';

interface Rows {
	tenderId: string;
	description: string;
	number: string;
	volume: string;
	unit: string;
	price: string;
}

// in the table I could easily edit the data and send it back to the API.
// I'll need to figure out how I handle that.
// Maybe form?

export const TenderTable = (): JSX.Element => {
	// add rows to the table
	const [rows, setRows] = useState<Rows[] | []>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [addedItems, setAddedItems] = useState(null);
	const [showText, setShowText] = useState(false);
	const [disabledInput, setDisabledInput] = useState(true);

	// This is to add the single item
	// const mutate = useAddTenderItem();

	const handleEditClick = () => {
		setIsEditing(!isEditing);
	};

	const handleClick = () => {
		setShowText(true);
		setDisabledInput(false);
	};

	const addNewRow = () => {
		const data: Rows = {
			tenderId: '',
			description: '',
			number: 'b',
			volume: 'c',
			unit: 'd',
			price: 'e'
		};
		setRows([...rows, data]);
		// setDisabledInput(!disabledInput);
	};

	// const response = {
	// 	description: 'test1',
	// 	number: 'test1',
	// 	volume: 'test1',
	// 	unit: 'test1',
	// 	price: 'test1'
	// };

	const addItem = async () => {
		// const response = await axios.post(ApiService.addTenderItem);
		// return response.data;
		// await mutate.mutateAsync(response);
	};

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
						{rows.map((row) => {
							return (
								<>
									<Tr key={row.number}>
										<Td>
											<Input
												value={''}
												// disabled={disabledInput}
												width={'60'}
											/>
										</Td>
										<Td>
											<Input
												value={row.number}
												// disabled={disabledInput}
												width={'20'}
											/>
										</Td>
										<Td>
											<Input
												value={row.volume}
												// disabled={disabledInput}
												width={'24'}
											/>
										</Td>
										<Td>
											<Input
												value={row.unit}
												// disabled={disabledInput}
												width={'20'}
											/>
										</Td>
										{/* <Td>
											<Input
												value={''}
												disabled={disabledInput}
												width={'20'}
											/>
										</Td> */}
										<Td>{isEditing ? <Input value={''} /> : row.price}</Td>
										<Td>
											<Button onClick={handleEditClick}>
												{isEditing ? 'Save' : 'Edit'}
											</Button>
										</Td>
									</Tr>
								</>
							);
						})}
						{/* <Tr>
							<Td>
								<Input disabled={disabledInput} width={'60'} />
							</Td>
							<Td>
								<Input disabled={disabledInput} width={'20'} />
							</Td>
							<Td>
								<Input disabled={disabledInput} width={'24'} />
							</Td>
							<Td>
								<Input disabled={disabledInput} width={'20'} />
							</Td>
							<Td>
								<Input disabled={disabledInput} width={'20'} />
							</Td>
						</Tr> */}
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
			<Spacer />
			<Box>
				<HStack justifyContent={'space-between'}>
					<Box>
						{showText ? (
							<>
								{addedItems ? (
									<Text>
										You have updated at least one of the items of the Tender,
										make sure you add the new value
									</Text>
								) : (
									<Text>Add items to the Tender</Text>
								)}
							</>
						) : null}
					</Box>
					<Box>
						<HStack>
							{/* <Button onClick={() => handleClick()}>Edit Items</Button> */}
							<Button onClick={() => addItem()}>Add Items</Button>
							<Button onClick={() => addNewRow()}>Add new Row</Button>
						</HStack>
					</Box>
				</HStack>
			</Box>
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
