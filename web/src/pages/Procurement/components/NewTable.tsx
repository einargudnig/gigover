import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tender } from '../../../models/Tender';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
// import { useModifyTenderItem } from '../../../mutations/useModifyTenderItem';
import { useTenderById } from '../../../mutations/getTenderById';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Table,
	Text,
	Tbody,
	Td,
	Thead,
	Tr
} from '@chakra-ui/react';

// ! Not needed? -> imported from types folder?
interface Item {
	tenderItemId?: number;
	description: string;
	number: number;
	volume: number;
	unit: string;
}

export const NewTable: React.FC = () => {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	//! GET from database
	const {
		data
		// isLoading: isTenderLoading,
		// isError: isTenderError,
		// error: tenderError
	} = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderItems = tender?.items;
	// console.log('TENDERItems', tenderItems);

	const [items, setItems] = useState<Item[] | undefined>(tenderItems);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [formData, setFormData] = useState<Item>({
		description: 'Description',
		number: 0,
		volume: 0,
		unit: 'Unit of measuerment'
	});

	//! react-query stuff
	//! POST
	const { mutate, isLoading, isSuccess, isError, error } = useAddTenderItem();
	// const { mutate: mutateUpdate } = useModifyTenderItem();
	// const { data } = useTenderById(11); //from useParams
	// console.log('DATA in TENDER', { data });

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
			unit: ''
		});
		// mutate to POST data to backend
		//! This does work, it returns a 200 status code

		// I have an endpoint now tender/tender/:id -> It returns the tender with the tenderItems. I can use that to show the items in the table AND for the table header.
		// mutate(formData);
	};

	const handleEdit = (item: Item) => {
		setEditingItem(item);
		setFormData({ ...item });
	};

	const handleUpdate = () => {
		setItems(
			items?.map((item) => (item.number === editingItem?.number ? { ...formData } : item))
		);
		setEditingItem(null);
		setFormData({
			description: '',
			number: 0,
			volume: 0,
			unit: ''
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
					{items?.map((item) => (
						<Tr key={item.number}>
							<Td>{item.description}</Td>
							<Td>{item.number}</Td>
							<Td>{item.volume}</Td>
							<Td>{item.unit}</Td>
							<Td>
								<Button onClick={() => handleEdit(item)}>Edit</Button>
							</Td>
						</Tr>
					))}
					{isSuccess && console.log('Success', formData)}
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
