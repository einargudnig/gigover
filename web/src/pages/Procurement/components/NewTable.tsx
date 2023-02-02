import React, { useState } from 'react';
// import { TenderItem } from '../../../models/TenderItems';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
import { useModifyTenderItem } from '../../../mutations/useModifyTenderItem';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Spacer,
	Table,
	Text,
	Tbody,
	Td,
	Thead,
	Tr,
	VStack
} from '@chakra-ui/react';

interface Item {
	tenderItemId?: number;
	description: string;
	number: number;
	volume: number;
	unit: string;
	price: number;
}

export const NewTable: React.FC = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [formData, setFormData] = useState<Item>({
		description: 'Description',
		number: 0,
		volume: 0,
		unit: 'Unit of measuerment',
		price: 0
	});

	//! react-query stuff
	const { mutate, isLoading, isError, error } = useAddTenderItem();
	const { mutate: mutateUpdate } = useModifyTenderItem();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleAdd = () => {
		setItems([...items, formData]);
		setFormData({
			description: '',
			number: 0,
			volume: 0,
			unit: '',
			price: 0
		});
		// mutate to POST data to backend
		//! This does work, it returns a 200 status code
		// BUT the ids are not increasing.
		// I'll ask Tommi for a REST enpoint for GET request on tenderItems/{tenderId}
		// I will need that to get the items I've already sent to the table.
		mutate(formData);
		console.log('Success', formData);
	};

	const handleEdit = (item: Item) => {
		setEditingItem(item);
		setFormData({ ...item });
	};

	const handleUpdate = () => {
		setItems(
			items.map((item) => (item.number === editingItem?.number ? { ...formData } : item))
		);
		setEditingItem(null);
		setFormData({
			description: '',
			number: 0,
			volume: 0,
			unit: '',
			price: 0
		});
		//! Mutate to UPDATE data to backend
		// mutateUpdate(formData);
		// console.log('Success', formData);
	};

	return (
		<>
			<Table>
				<Thead>
					<Tr>
						<Td>Description</Td>
						<Td>Number</Td>
						<Td>Volume</Td>
						<Td>Unit</Td>
						<Td>Price</Td>
						<Td>Actions</Td>
					</Tr>
				</Thead>
				<Tbody>
					{isError && (
						<>
							{/* Server errors */}
							{/* <p>{error?.errorText}</p>
							<small>{error?.errorCode}</small> */}
							<p>Oh no! You have an error :(</p>
						</>
					)}
					{items.map((item) => (
						<Tr key={item.number}>
							<Td>{item.description}</Td>
							<Td>{item.number}</Td>
							<Td>{item.volume}</Td>
							<Td>{item.unit}</Td>
							<Td>{item.price}</Td>
							<Td>
								<Button onClick={() => handleEdit(item)}>Edit</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
			<br />

			<Text>
				To get items into the table you need to write it into the form below, and press the
				Add item button.
			</Text>
			<br />
			<Text>
				To edit items in the table you must press the Edit button in the Action column. You
				will then be able to edit the item in the form below. When you are done editing the
				item, press the Update item button.
			</Text>
			<br />
			<Box mb={2} mt={2} p={2} borderRadius={6} borderColor={'#EFEFEE'}>
				<FormControl>
					{/* <Form></Form> */}
					<FormLabel htmlFor="description">Description</FormLabel>
					<Input
						id="description"
						name="description"
						type="text"
						value={formData.description}
						onChange={handleChange}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="number">Number</FormLabel>
					<Input
						id="number"
						name="number"
						type="number"
						value={formData.number}
						onChange={handleChange}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="volume">Volume</FormLabel>
					<Input
						id="volume"
						name="volume"
						type="number"
						value={formData.volume}
						onChange={handleChange}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="unit">Unit</FormLabel>
					<Input
						id="unit"
						name="unit"
						type="text"
						value={formData.unit}
						onChange={handleChange}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="price">Price</FormLabel>
					<Input
						id="price"
						name="price"
						type="number"
						value={formData.price}
						onChange={handleChange}
					/>
				</FormControl>
			</Box>
			<br />
			<Flex justifyContent={'end'}>
				<HStack>
					{editingItem ? (
						<Button onClick={handleUpdate}>Update item</Button>
					) : (
						<Button onClick={handleAdd}>Add item</Button>
					)}
				</HStack>
			</Flex>
		</>
	);
};
