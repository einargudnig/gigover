import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BidItems } from '../../../../models/Tender';
import { useAddClientBidItem } from '../../../../mutations/procurement/client-bids/useAddBidItem';
import { useRemoveClientBidItem } from '../../../../mutations/procurement/client-bids/useDeleteBidItem';

import {
	Button,
	FormControl,
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
// import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
// import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { Edit } from '../../../../components/icons/Edit';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { CrossIcon } from '../../../../components/icons/CrossIcon';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';

export const BidIdTable = ({ bidItems }): JSX.Element => {
	const { bidId } = useParams();
	// console.log({ bidItems });

	// ! fakeData until the backend stuff is working!

	const defaultData: BidItems = {
		bidId: Number(bidId),
		nr: '0',
		description: 'Description',
		volume: 0,
		cost: 0
	};

	//! For now I'm only using this state variable for the updating of items. Since I had major issues with it I'm going to leave it like that!
	//eslint-disable-next-line
	const [items, setItems] = useState<BidItems[] | undefined>(bidItems || []);
	const [editingItem, setEditingItem] = useState<BidItems | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [formData, setFormData] = useState<BidItems>({
		bidId: Number(bidId),
		description: 'Description',
		nr: '0',
		volume: 0,
		cost: 0
	});
	// eslint-disable-next-line
	const [updateFormData, setUpdateFormData] = useState<BidItems>({
		bidId: Number(bidId),
		description: 'Description',
		nr: '0',
		volume: 0,
		cost: 0
	});

	useEffect(() => {
		setItems(bidItems);
	}, [bidItems]);

	const {
		mutate,
		isLoading: isMutateLoading,
		isError: isMutateError,
		error: mutateError
	} = useAddClientBidItem();
	// TODO EditItem
	// const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useEditClientBidItem();
	const { mutateAsync: deleteClientBidItem, isLoading: isDeleteLoading } =
		useRemoveClientBidItem();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setUpdateFormData({
			...updateFormData,
			[name]: value
		});
	};

	const handleAdd = () => {
		// setItems([...[items], formData]); //! I think this is not needed
		setFormData({
			bidId: Number(bidId),
			description: formData.description,
			nr: formData.nr,
			volume: formData.volume,
			cost: formData.cost
		});
		console.log('Items', items);
		mutate(formData);
		setFormData({ ...defaultData });
		// console.log('mutate with this formData:', formData); // Good for debugging
	};

	const handleEdit = (item: BidItems) => {
		setEditingItem(item);
		setUpdateFormData(item);
	};

	const handleUpdate = (item: BidItems) => {
		console.log('Editing item:', item);
		console.log('Editing item:', item);

		// Update the local items state
		setItems(
			bidItems?.map((i) => (i.bidItemId === editingItem?.bidItemId ? updateFormData : i))
		);

		// Send the updated item to the server
		// TODO add editItem
		// mutateUpdate(updateFormData);

		// Reset the editing state
		setEditingItem(null);
	};

	// const finishDateStatus = handleFinishDate(clientBid?.finishDate);
	const finishDateStatus = false;
	// const finishDateStatus = true;

	return (
		<>
			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<Tooltip label="Cost Code">
								<HStack>
									<Text>Number</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Description of a item">
								<HStack>
									<Text>Description</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Volume">
								<HStack>
									<Text>Volume</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Tooltip label="Unit of measurement. For example: m2, kg, t">
								<HStack>
									<Text>Cost</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Tooltip>
						</Th>

						<Th width={'20%'}>
							<Text>Actions</Text>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{bidItems?.length === 0 ? (
						<Tr>
							<Td></Td>
							<Td></Td>
							<Td>
								<Text fontSize="xl">The table is empty!</Text>
							</Td>
							<Td></Td>
							<Td></Td>
						</Tr>
					) : null}
					<>
						{bidItems?.map((item) => (
							<Tr key={item.bidItemId}>
								<Td width={'20%'}>
									{editingItem === item ? (
										<Input
											name="nr"
											value={updateFormData.nr}
											onChange={handleUpdateChange}
										/>
									) : (
										item.nr
									)}
								</Td>
								<Td width={'20%'}>
									{editingItem === item ? (
										<Input
											name="description"
											value={updateFormData.description}
											onChange={handleUpdateChange}
										/>
									) : (
										item.description
									)}
								</Td>
								<Td width={'20%'}>
									{editingItem === item ? (
										<Input
											name="volume"
											value={updateFormData.volume}
											onChange={handleUpdateChange}
										/>
									) : (
										item.volume
									)}
								</Td>
								<Td width={'20%'}>
									{editingItem === item ? (
										<Input
											name="unit"
											value={updateFormData.cost}
											onChange={handleUpdateChange}
										/>
									) : (
										item.cost
									)}
								</Td>
								{/* Action buttons */}
								<Td width={'20%'}>
									{editingItem === item ? (
										<HStack>
											<Button
												aria-label={'Update item'}
												onClick={() => handleUpdate(item)}
											>
												{/* {isUpdateLoading ? <LoadingSpinner /> : 'Update'} */}
												Update
											</Button>
											<Button
												onClick={() => {
													setFormData({
														bidId: Number(bidId),
														description: '',
														nr: '0',
														volume: 0,
														cost: 0
													});
													setEditingItem(null);
												}}
											>
												<CrossIcon size={24} />
											</Button>
										</HStack>
									) : (
										<HStack>
											<Button
												aria-label={'Edit item'}
												onClick={() => handleEdit(item)}
											>
												<Edit size={20} />
											</Button>
											<ConfirmDialog
												header={'Delete item'}
												setIsOpen={setDialogOpen}
												callback={async (b) => {
													if (b) {
														await deleteClientBidItem(item);
														console.log('Deleting item:', item); // Good for debugging
													}

													setDialogOpen(false);
													setFormData({
														bidId: Number(bidId),
														description: '',
														nr: '0',
														volume: 0,
														cost: 0
													});
												}}
												isOpen={dialogOpen}
											>
												<Button
													aria-label={'Delete item'}
													colorScheme={'red'}
													isLoading={isDeleteLoading}
													onClick={() => setDialogOpen(true)}
												>
													<TrashIcon color={'white'} size={20} />
												</Button>
											</ConfirmDialog>
										</HStack>
									)}
								</Td>
							</Tr>
						))}
					</>

					{finishDateStatus ? (
						<Text marginTop={'2'} marginBottom={'2'} color={'gray.500'}>
							The finish date has passed, you cannot add more items to the Tender
						</Text>
					) : (
						<>
							<Text marginTop={'2'} marginBottom={'2'} color={'gray.500'}>
								Enter details below to add items to tender
							</Text>

							<Tr>
								<Td width={'20%'}>
									<FormControl id="nr">
										<Input
											width={'200px'}
											id="nr"
											name="nr"
											type="number"
											value={formData.nr}
											onChange={handleChange}
										/>
									</FormControl>
								</Td>
								<Td width={'20%'}>
									<FormControl id="description">
										<Input
											htmlSize={4}
											id="description"
											name="description"
											type="text"
											value={formData.description}
											onChange={handleChange}
										/>
									</FormControl>
								</Td>
								<Td width={'20%'}>
									<FormControl id="volume">
										<Input
											htmlSize={4}
											id="volume"
											name="volume"
											type="text"
											value={formData.volume}
											onChange={handleChange}
										/>
									</FormControl>
								</Td>
								<Td>
									<FormControl id="cost">
										<Input
											htmlSize={4}
											id="cost"
											name="cost"
											type="text"
											value={formData.cost}
											onChange={handleChange}
										/>
									</FormControl>
								</Td>
								<Td width={'20%'}>
									<Button onClick={handleAdd}>
										{isMutateLoading ? <LoadingSpinner /> : 'Add item'}
									</Button>
								</Td>
							</Tr>
						</>
					)}

					{isMutateError ? (
						<Td>
							<Text>Something went wrong - {mutateError?.code}</Text>
						</Td>
					) : null}
				</Tbody>
			</Table>
		</>
	);
};
