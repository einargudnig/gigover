import {
	Button,
	Flex,
	FormControl,
	FormHelperText,
	HStack,
	Input,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { CrossIcon } from '../../../../components/icons/CrossIcon';
import { Edit } from '../../../../components/icons/Edit';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { BidItem } from '../../../../models/Tender';
import { useAddBidItem } from '../../../../mutations/procurement/client-bids/useAddBidItem';
import { useDeleteBidItem } from '../../../../mutations/procurement/client-bids/useDeleteBidItem';
import { useEditBidItem } from '../../../../mutations/procurement/client-bids/useEditBidItem';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';

export const BidIdTable = ({ bid }): JSX.Element => {
	const bidId = bid?.bidId;
	const clientBidStatus = bid?.status;

	const finishDateStatus = handleFinishDate(bid?.finishDate);
	const bidItems = bid?.items;

	const defaultData: BidItem = {
		bidId,
		nr: '0',
		description: 'Description',
		volume: 0,
		unit: 'Unit',
		cost: 0
	};

	//! For now I'm only using this state variable for the updating of items. Since I had major issues with it I'm going to leave it like that!
	//eslint-disable-next-line
	const [items, setItems] = useState<BidItem[] | undefined>(bidItems || []);
	const [editingItem, setEditingItem] = useState<BidItem | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [formData, setFormData] = useState<BidItem>({
		bidId,
		description: 'Description',
		nr: '0',
		volume: 0,
		unit: 'Unit',
		cost: 0
	});
	// eslint-disable-next-line
	const [updateFormData, setUpdateFormData] = useState<BidItem>({
		bidId,
		description: 'Description',
		nr: '0',
		volume: 0,
		unit: 'Unit',
		cost: 0
	});

	useEffect(() => {
		setItems(bidItems);
	}, [bidItems]);

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const {
		mutate: mutateAdd,
		isLoading: isMutateLoading,
		isError: isMutateError,
		error: mutateError
	} = useAddBidItem();

	const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useEditBidItem(); // TODO make sure this works!
	const { mutateAsync: deleteClientBidItem, isLoading: isDeleteLoading } = useDeleteBidItem();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = event.target;
		const updatedValue = type === 'number' ? parseFloat(value) : value;
		setFormData({
			...formData,
			[name]: updatedValue
		});
		// setFormData({
		// 	...formData,
		// 	[name]: value
		// });
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
			bidId,
			nr: formData.nr,
			description: formData.description,
			volume: formData.volume,
			unit: formData.unit,
			cost: formData.cost
		});

		mutateAdd(formData);
		setFormData({ ...defaultData });
	};

	const handleEdit = (item: BidItem) => {
		setEditingItem(item);
		setUpdateFormData(item);
	};

	const handleUpdate = (item: BidItem) => {
		console.log('Editing item:', item);

		// Update the local items state
		setItems(
			bidItems?.map((i) => (i.bidItemId === editingItem?.bidItemId ? updateFormData : i))
		);

		// Send the updated item to the server
		mutateUpdate(updateFormData);
		// Reset the editing state
		setEditingItem(null);
	};

	// We only want the unit to be max 4 characters kg, m2, l, etc
	const isInvalidUnit = formData.unit!.length > 5;

	// eslint-disable-next-line
	const isInvalidCost = formData.cost! >= 100000;

	return (
		<Table variant={'striped'}>
			<Thead>
				<Tr>
					<Th width={'20%'}>
						<Tooltip hasArrow label="Number">
							<HStack>
								<Text>Number</Text>
								<ImportantIcon size={20} />
							</HStack>
						</Tooltip>
					</Th>

					<Th width={'20%'}>
						<Tooltip hasArrow label="Description of a item">
							<HStack>
								<Text>Description</Text>
								<ImportantIcon size={20} />
							</HStack>
						</Tooltip>
					</Th>

					<Th width={'20%'}>
						<Tooltip hasArrow label="Volume">
							<HStack>
								<Text>Volume</Text>
								<ImportantIcon size={20} />
							</HStack>
						</Tooltip>
					</Th>

					<Th width={'20%'}>
						<Tooltip hasArrow label="Unit of measurement. For example: m2, kg, t">
							<HStack>
								<Text>Unit</Text>
								<ImportantIcon size={20} />
							</HStack>
						</Tooltip>
					</Th>

					<Th width={'20%'}>
						<Tooltip hasArrow label="Cost">
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
							<Text fontSize="xl">The table is empty.</Text>
						</Td>
						<Td>
							<Text fontSize="xl">Use the form below!</Text>
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
										value={updateFormData.unit}
										onChange={handleUpdateChange}
									/>
								) : (
									item.unit
								)}
							</Td>
							<Td width={'20%'}>
								{editingItem === item ? (
									<Input
										name="cost"
										value={updateFormData.cost}
										onChange={handleUpdateChange}
									/>
								) : (
									formatNumber(item.cost)
								)}
							</Td>
							{/* Action buttons */}
							<Td width={'20%'}>
								{editingItem === item ? (
									<HStack>
										<Button
											aria-label={'Update item'}
											isLoading={isUpdateLoading}
											onClick={() => handleUpdate(item)}
											variant={'outline'}
											colorScheme={'black'}
										>
											Update
										</Button>
										<Button
											onClick={() => {
												setFormData({
													bidId,
													description: '',
													nr: '0',
													volume: 0,
													unit: 'Unit',
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
											isDisabled={clientBidStatus === 1 || finishDateStatus}
											variant={'outline'}
											colorScheme={'black'}
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
													bidId,
													description: '',
													nr: '0',
													volume: 0,
													unit: 'Unit',
													cost: 0
												});
											}}
											isOpen={dialogOpen}
										>
											<Button
												aria-label={'Delete item'}
												colorScheme={'red'}
												variant={'outline'}
												isLoading={isDeleteLoading}
												onClick={() => setDialogOpen(true)}
												isDisabled={
													clientBidStatus === 1 || finishDateStatus
												}
											>
												<TrashIcon color={'red'} size={20} />
											</Button>
										</ConfirmDialog>
									</HStack>
								)}
							</Td>
						</Tr>
					))}
				</>

				{!finishDateStatus ? (
					<>
						{clientBidStatus === 0 ? (
							<>
								<Text marginTop={'2'} marginBottom={'2'} color={'gray.500'}>
									Enter details below to add items to bid
								</Text>

								<Tr>
									<Td width={'20%'}>
										<FormControl id="nr">
											<Input
												id="nr"
												name="nr"
												type="text"
												value={formData.nr}
												onChange={handleChange}
											/>
										</FormControl>
									</Td>
									<Td width={'20%'}>
										<FormControl id="description">
											<Input
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
												id="volume"
												name="volume"
												type="number"
												value={formData.volume}
												onChange={handleChange}
											/>
										</FormControl>
									</Td>
									<Td width={'20%'}>
										<FormControl id="unit" isInvalid={isInvalidUnit}>
											<Input
												id="unit"
												name="unit"
												type="text"
												value={formData.unit}
												onChange={handleChange}
											/>
											{isInvalidUnit ? (
												<FormHelperText>
													The measurement of unit should be in a short
													format: kg, m, m2
												</FormHelperText>
											) : null}
										</FormControl>
									</Td>
									<Td>
										<FormControl id="cost" isInvalid={isInvalidCost}>
											<Input
												id="cost"
												name="cost"
												type="number"
												value={formData.cost}
												onChange={handleChange}
											/>
											{isInvalidCost ? (
												<FormHelperText>
													This will be update soon, now the cost has to be
													lower than 100.000
												</FormHelperText>
											) : null}
										</FormControl>
									</Td>
									<Td width={'20%'}>
										<Button
											onClick={handleAdd}
											variant={'outline'}
											colorScheme={'black'}
										>
											{isMutateLoading ? <LoadingSpinner /> : 'Add item'}
										</Button>
									</Td>
								</Tr>
							</>
						) : null}
					</>
				) : (
					<Flex alignItems={'center'} justifyContent={'center'}>
						<Text marginTop={'2'} marginBottom={'2'} color={'gray.500'}>
							The finish date has passed, you cannot add more items to the Bid
						</Text>
					</Flex>
				)}

				{isMutateError ? (
					<Td>
						<Text>Something went wrong - {mutateError?.code}</Text>
					</Td>
				) : null}
			</Tbody>
		</Table>
	);
};
