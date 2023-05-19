import React, { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	FormHelperText,
	HStack,
	Input,
	Table,
	Text,
	Tbody,
	Td,
	Thead,
	Th,
	Tr,
	Tooltip,
	Spacer
	// useToast
} from '@chakra-ui/react';
import { TenderItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import ScrollIntoView from 'react-scroll-into-view'; // Nice for the UX, to scroll the edit form into view when pressing edit button
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';

export const OfferTable = ({ tenderItems }): JSX.Element => {
	const { tenderId } = useParams();
	const {
		mutateAsync: addOfferItems,
		isLoading: addOfferItemsLoading,
		isError: isMutateError,
		error: mutateError
	} = useAddOfferItems();

	//eslint-disable-next-line
	const [items, setItems] = useState<TenderItem[] | undefined>(tenderItems || []);
	const [productNumber, setProductNumber] = useState('');
	const [cost, setCost] = useState(0);
	const [notes, setNotes] = useState('');

	const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
	const [formData, setFormData] = useState<TenderItem>({
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit'
	});

	// const toast = useToast();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleAdd = () => {
		// setItems([...[items], formData]); //! I think this is not needed
		addOfferItems({
			...formData,
			productNumber,
			cost,
			notes
		});

		// Reset the form fields
		setFormData({
			tenderId: Number(tenderId),
			description: 'Description',
			nr: 0,
			volume: 0,
			unit: 'Unit'
		});
		setProductNumber('');
		setCost(0);
		setNotes('');
		// console.log('mutate with this formData:', formData); // Good for debugging
	};

	// This works, It 'sends' the selected row to the edit form
	const handleEdit = (item: TenderItem) => {
		setEditingItem(item);
		setFormData({ ...item });
		setProductNumber('');
		setCost(0);
		setNotes('');
	};

	return (
		<>
			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Tooltip label="Does this item have a special number?">
							<Th>
								<HStack>
									<p>Number</p>
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Description of a item">
							<Th>
								<HStack>
									<p>Description</p>
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Volume">
							<Th>
								<HStack>
									<p color={'black'}>Volume</p>
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Unit of measurement. For example: m2, kg, t">
							<Th>
								<HStack>
									<p>Unit</p>
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="This is your product number">
							<Th>
								<HStack>
									<p>Product number</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Cost for this item, per one unit of it">
							<Th>
								<HStack>
									<p>Cost pr. item</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Anything you would want add for this item?">
							<Th>
								<HStack>
									<p>Notes/certifications</p>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Th>
							<p>Actions</p>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((item) => (
						<Tr key={item.tenderItemId}>
							<Td>{item.nr}</Td>
							<Td>{item.description}</Td>
							<Td>{item.volume}</Td>
							<Td>{item.unit}</Td>
							<Td>{productNumber}</Td>
							<Td>{cost}</Td>
							<Td>{notes}</Td>
							<Td>
								<ScrollIntoView selector="#editItem">
									<Button onClick={() => handleEdit(item)}>Edit</Button>
								</ScrollIntoView>
							</Td>
						</Tr>
					))}
					{tenderItems?.length === 0 ? (
						<Td>
							<Text fontSize="xl">
								The table is empty! To add items into the table you need to write it
								into the form below, and press the Add item button.
							</Text>
						</Td>
					) : null}
					{isMutateError ? (
						<Td>
							<Text>Something went wrong - {mutateError?.code}</Text>
						</Td>
					) : null}
				</Tbody>
			</Table>
			<br />

			{tenderItems?.length !== 0 ? (
				<Text fontSize="md">
					To edit or delete items in the table you must press the Edit button in the
					Action column. You will then be able to edit the item in the form below. When
					you are done editing the item, press the Update item button.
				</Text>
			) : null}
			<br />
			<Box mb={2} mt={2} p={2} borderRadius={6} borderColor={'#EFEFEE'} id="editItem">
				<FormControl>
					<FormLabel htmlFor="number">Number</FormLabel>
					<Input
						id="nr"
						name="nr"
						type="number"
						value={formData.nr}
						onChange={handleChange}
						disabled={true}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="description">Description</FormLabel>
					<Input
						id="description"
						name="description"
						type="text"
						value={formData.description}
						onChange={handleChange}
						disabled={true}
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
						disabled={true}
					/>
				</FormControl>
				<br />
				<FormControl id={'unit'}>
					<FormLabel htmlFor="unit">Unit</FormLabel>
					<Input
						id="unit"
						name="unit"
						type="text"
						value={formData.unit}
						onChange={handleChange}
						disabled={true}
					/>
				</FormControl>
				<FormControl>
					<FormLabel htmlFor="productNumber">Product number</FormLabel>
					<Input
						id="productNumber"
						name="productNumber"
						type="text"
						value={productNumber}
						onChange={(event) => setProductNumber(event.target.value)}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="cost">Cost pr. item</FormLabel>
					<Input
						id="cost"
						name="cost"
						type="number"
						value={cost}
						onChange={(event) => setCost(Number(event.target.value))}
					/>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel htmlFor="notes">Notes/certifications</FormLabel>
					<Input
						id="notes"
						name="notes"
						type="text"
						value={notes}
						onChange={(event) => setNotes(event.target.value)}
					/>
				</FormControl>
			</Box>
			<br />
			<Flex justifyContent={'end'} mb={'6'}>
				<HStack>
					{editingItem ? (
						<HStack>
							<Button onClick={handleAdd}>
								{addOfferItemsLoading ? <LoadingSpinner /> : 'Add item'}
							</Button>
						</HStack>
					) : null}
				</HStack>
			</Flex>

			<Flex mb={'2'}>
				<Text>When the offer is ready you can publish it.</Text>
				<Spacer />
			</Flex>
		</>
	);
};
