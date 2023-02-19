import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTenderById } from '../../../queries/useGetTenderById';
import { useAddOfferItems } from '../../../mutations/useAddOfferItems';
import { Tender, TenderItem } from '../../../models/Tender';
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
	Th,
	Tr,
	Tooltip
} from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import ScrollIntoView from 'react-scroll-into-view'; // Nice for the UX, to scroll the edit form into view when pressing edit button

export const OfferTable = (): JSX.Element => {
	const { tenderId } = useParams(); //! CAST to number
	// Get the tender from the database
	const {
		data,
		isLoading: isTenderLoading,
		isError: isTenderError,
		error: tenderError
	} = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderItems: TenderItem[] | undefined = data?.tender?.items;

	// Add offers
	const { mutate: addOfferItems, isLoading: isAddingOfferItems } = useAddOfferItems();

	const [items, setItems] = useState<TenderItem[] | undefined>(tenderItems || []);

	const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
	const [formData, setFormData] = useState({
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit',
		cost: 0,
		notes: ''
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleAdd = () => {
		// setItems([...[items], formData]); //! I think this is not needed
		setFormData({
			tenderId: Number(tenderId),
			description: formData.description,
			nr: formData.nr,
			volume: formData.volume,
			unit: formData.unit,
			cost: formData.cost,
			notes: formData.notes
		});
		addOfferItems(formData);
		// console.log('mutate with this formData:', formData); // Good for debugging
	};

	// This works, It 'sends' the selected row to the edit form
	const handleEdit = (item: TenderItem) => {
		setEditingItem(item);
		// setFormData({ ...item });
	};

	// const handleUpdate = () => {
	// 	setItems(
	// 		tenderItems?.map((item) =>
	// 			item.tenderItemId === editingItem?.tenderItemId ? { ...formData } : item
	// 		)
	// 	);

	// 	// console.log('Mutating tenderItem with this formData:', formData); // Good for debugging

	// 	setEditingItem(null);
	// 	setFormData({
	// 		tenderId: Number(tenderId),
	// 		description: '',
	// 		nr: 0,
	// 		volume: 0,
	// 		unit: ''
	// 	});
	// };

	const handlePublish = () => {
		if (tender !== undefined) {
			// publishTender(tender);
			alert('Tender published!');
		} else {
			alert('Something went wrong');
		}
	};

	const notes = ''; //! This is just to get this up and running.
	const cost = 0; //! This is just to get this up and running.
	// This should be empty. I as the offerer should be able to add notes to this.

	return (
		<>
			{isTenderLoading ? (
				<LoadingSpinner />
			) : isTenderError ? (
				<Text>
					Something went wrong - {tenderError?.errorText} - {tenderError?.errorCode}
				</Text>
			) : (
				<Table variant={'striped'}>
					{/* <Thead position="sticky" top={0} zIndex="docked">
						// This might come in handy, it makes the table header sticky. It does not look suuper good, but the funcitonality is there.
						// Let's keep it commented out and see where it goes.
					*/}
					<Thead>
						<Tr>
							<Tooltip label="Does this item have a product number?">
								<Th>
									<HStack>
										<p>Number</p>
										<ImportantIcon size={20} />
									</HStack>
								</Th>
							</Tooltip>

							<Tooltip label="Description of a item">
								<Th>
									<HStack>
										<p>Description</p>
										<ImportantIcon size={20} />
									</HStack>
								</Th>
							</Tooltip>

							<Tooltip label="Volume">
								<Th>
									<HStack>
										<p color={'black'}>Volume</p>
										<ImportantIcon size={20} />
									</HStack>
								</Th>
							</Tooltip>

							<Tooltip label="Unit of measurement. For example: m2, kg, t">
								<Th>
									<HStack>
										<p>Unit</p>
										<ImportantIcon size={20} />
									</HStack>
								</Th>
							</Tooltip>

							<Tooltip label="Cost of this item">
								<Th>
									<HStack>
										<p>Cost</p>
										<ImportantIcon size={20} />
									</HStack>
								</Th>
							</Tooltip>

							<Tooltip label="Anything you want to add here regarding this item?">
								<Th>
									<HStack>
										<p>Notes</p>
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
								<Td>{cost}</Td>
								<Td>{notes}</Td>
								<Td>
									<ScrollIntoView selector="#offerItem">
										<Button onClick={() => handleEdit(item)}>Offer</Button>
									</ScrollIntoView>
								</Td>
							</Tr>
						))}
						{tenderItems?.length === 0 ? (
							<Text fontSize="xl">
								This table is empty. Something is not correct. Please contact the
								administrator.
							</Text>
						) : null}
					</Tbody>
				</Table>
			)}
			<br />

			{tenderItems?.length !== 0 ? (
				<Text fontSize="md">
					To add offers to items you press the Offer button in the table
				</Text>
			) : null}
			<br />
			<Box mb={2} mt={2} p={2} borderRadius={6} borderColor={'#EFEFEE'} id="offerItem">
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
					<FormLabel htmlFor="description">Description</FormLabel>
					<Input
						id="description"
						name="description"
						type="text"
						value={formData.description}
						isDisabled={true} //! This should not be editable
						// onChange={handleChange}
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
						isDisabled={true} //! This should not be editable
						// onChange={handleChange}
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
						isDisabled={true} //! This should not be editable
						// onChange={handleChange}
					/>
				</FormControl>
				<br />
				<FormControl id={'cost'}>
					<FormLabel htmlFor="unit">Cost</FormLabel>
					<Input
						id="cost"
						name="cost"
						type="number"
						value={formData.cost}
						onChange={handleChange}
					/>
				</FormControl>
				<br />
				<FormControl id={'notes'}>
					<FormLabel htmlFor="unit">Notes</FormLabel>
					<Input
						id="notes"
						name="notes"
						type="text"
						value={formData.notes}
						onChange={handleChange}
					/>
				</FormControl>
			</Box>
			<br />
			<Flex justifyContent={'end'} mb={'6'}>
				<HStack>
					{tender === undefined ? null : editingItem ? (
						<HStack>
							{/* <Button onClick={handleUpdate}>
								{isUpdateLoading ? <LoadingSpinner /> : 'Update item'}
							</Button> */}
							{/* //! This button deletes the selected item */}
						</HStack>
					) : (
						<Button onClick={handleAdd}>
							{/* {isMutateLoading ? <LoadingSpinner /> : 'Add item'} */}
							Add Offer to Item
						</Button>
					)}
				</HStack>
			</Flex>

			<Text>When the tender is ready you can publish it.</Text>
			{/* onClick handler that publishes the tender
				// it also open a dialog where I can add email that I want to send an invitation to
			*/}
			<Flex>
				<Button mt={'2'} onClick={handlePublish}>
					{/* {isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'} */}
					Publish Offer
				</Button>
			</Flex>
		</>
	);
};
