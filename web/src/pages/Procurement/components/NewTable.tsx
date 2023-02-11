import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tender, TenderItem } from '../../../models/Tender';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
import { useModifyTenderItem } from '../../../mutations/useModifyTenderItem';
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
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export const NewTable: React.FC = () => {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	//! GET from database
	const {
		data,
		isLoading: isTenderLoading, // I should use this to show a loading spinner
		isError: isTenderError, // I should use this to show an error message
		error: tenderError
	} = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderItems = tender?.items;

	//! NOTE I need to refactor this one out.
	// By using the state variable here I'm not able to re-render the table when I add a new item
	// I think it will be better when done!
	// const [items, setItems] = useState<TenderItem[] | undefined>(tenderItems || []);
	const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
	const [formData, setFormData] = useState<TenderItem>({
		tenderId: Number(tenderId),
		// description: 'Description',
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit of measuerment'
	});

	//! POST / Update
	const {
		mutate,
		isLoading: isMutateLoading,
		isError: isMutateError,
		error: mutateError
	} = useAddTenderItem();
	const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useModifyTenderItem();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	//! Maybe I don't need to add it to the state?
	// I can send it to the backend and then revalidate the get REQUEST
	const handleAdd = () => {
		// setItems([...[items], formData]); //! I think this here would help me update the table on submit. Since it adds it to the state
		setFormData({
			tenderId: Number(tenderId),
			description: formData.description,
			nr: formData.nr,
			volume: formData.volume,
			unit: formData.unit
		});
		mutate(formData);
		// console.log('mutate with this formData:', formData); // Good for debugging
	};

	// This works, It 'sends' the selected row to the edit form
	const handleEdit = (item: TenderItem) => {
		setEditingItem(item);
		setFormData({ ...item });
	};

	const handleUpdate = () => {
		const updatedFormData = tenderItems?.map((item) =>
			item.tenderItemId === editingItem?.tenderItemId ? { ...formData } : item
		);

		// setItems(
		// 	tenderItems?.map((item) =>
		// 		item.tenderItemId === editingItem?.tenderItemId ? { ...formData } : item
		// 	)
		// );

		// const updatedFormData = tenderItems?.map((item)) => item.tenderItemId === editingItem?.tenderItemId ? { ...formData } : item);
		setEditingItem(null);
		setFormData({
			tenderId: Number(tenderId),
			description: '',
			nr: 0,
			volume: 0,
			unit: ''
		});
		// mutateUpdate(updatedFormData);
		console.log('Mutating tenderItem with this formData:', formData);
	};

	return (
		<>
			{isTenderLoading ? (
				<LoadingSpinner />
			) : isTenderError ? (
				<Text>
					Something went wrong - {tenderError?.errorText} - {tenderError?.errorCode}
				</Text>
			) : (
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
						{tenderItems?.map((item) => (
							<Tr key={item.tenderItemId}>
								<Td>{item.description}</Td>
								<Td>{item.nr}</Td>
								<Td>{item.volume}</Td>
								<Td>{item.unit}</Td>
								<Td>
									<Button onClick={() => handleEdit(item)}>Edit</Button>
								</Td>
								<Td>
									{/* Need a clickHandler and a function to delete the Item */}
									<Button colorScheme={'red'}>Delete</Button>
								</Td>
							</Tr>
						))}
						{isMutateError ? (
							<Text>Something went wrong - {mutateError?.code}</Text>
						) : null}
					</Tbody>
				</Table>
			)}
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
						id="nr"
						name="nr"
						type="number"
						value={formData.nr}
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
				{/* //! I should put some validation here! */}
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
						<Button onClick={handleUpdate}>
							{isUpdateLoading ? <LoadingSpinner /> : 'Update item'}
						</Button>
					) : (
						<Button onClick={handleAdd}>
							{isMutateLoading ? <LoadingSpinner /> : 'Add item'}
						</Button>
					)}
				</HStack>
			</Flex>
		</>
	);
};
