import React, { useState } from 'react';
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

export const TenderTable = ({ tender }): JSX.Element => {
	// we would want to handle this as a useState I suspect

	const [addedItems, setAddedItems] = useState(null);
	const [showText, setShowText] = useState(false);
	const [disabledInput, setDisabledInput] = useState(true);

	const handleClick = () => {
		setShowText(true);
		setDisabledInput(false);
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
						{tender.map((item) => {
							return (
								<>
									<Tr key={item.number}>
										<Td>
											<Input
												value={item.description}
												disabled={disabledInput}
												width={'60'}
											/>
										</Td>
										<Td>
											<Input
												value={item.nr}
												disabled={disabledInput}
												width={'20'}
											/>
										</Td>
										<Td>
											<Input
												value={item.volume}
												disabled={disabledInput}
												width={'24'}
											/>
										</Td>
										<Td>
											<Input
												value={item.unit}
												disabled={disabledInput}
												width={'20'}
											/>
										</Td>
										<Td>
											<Input
												value={item.price}
												disabled={disabledInput}
												width={'20'}
											/>
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
							<Button onClick={() => handleClick()}>Edit Items</Button>
							<Button>Add Items</Button>
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
