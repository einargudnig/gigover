import {
	Box,
	Button,
	Flex,
	FormControl,
	FormHelperText,
	HStack,
	Heading,
	Input,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { CrossIcon } from '../../../../components/icons/CrossIcon';
import { Edit } from '../../../../components/icons/Edit';
import { ImportantIcon } from '../../../../components/icons/ImportantIcon';
import { TrashIcon } from '../../../../components/icons/TrashIcon';
import { TenderItem } from '../../../../models/Tender';
import { useAddTenderItem } from '../../../../mutations/procurement/useAddTenderItem';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { useDeleteTenderItem } from '../../../../mutations/procurement/useDeleteTenderItem';
import { useModifyTenderItem } from '../../../../mutations/procurement/useModifyTenderItem';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

interface AddItemsProps {
	tenderId: number;
	onItemsAdded: () => void;
}

export const AddItems = ({ tenderId }: AddItemsProps): JSX.Element => {
	const { data } = useGetTenderById(tenderId);
	const tender = data?.tender;
	console.log('Tender:', tender);

	const time = tender?.finishDate;
	const date = new Date(time!);
	const handleDelivery = tender?.delivery ? 'Yes' : 'No';

	const defaultData: TenderItem = {
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit'
	};

	const tenderItems: TenderItem[] | undefined = tender?.items;

	//! For now I'm only using this state variable for the updating of items. Since I had major issues with it I'm going to leave it like that!
	//eslint-disable-next-line
	const [items, setItems] = useState<TenderItem[] | undefined>(tenderItems || []);
	const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [formData, setFormData] = useState<TenderItem>({
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit'
	});
	// eslint-disable-next-line
	const [updateFormData, setUpdateFormData] = useState<TenderItem>({
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit'
	});

	useEffect(() => {
		setItems(tenderItems);
	}, [tenderItems]);

	const {
		mutate,
		isLoading: isMutateLoading,
		isError: isMutateError,
		error: mutateError
	} = useAddTenderItem();
	const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useModifyTenderItem();
	const { mutateAsync: deleteTenderItem, isLoading: isDeleteLoading } = useDeleteTenderItem();

	// We only want the unit to be max 4 characters kg, m2, l, etc
	const isInvalidUnit = formData.unit!.length > 5;

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
			tenderId: Number(tenderId),
			description: formData.description,
			nr: formData.nr,
			volume: formData.volume,
			unit: formData.unit
		});
		console.log('Items', items);
		mutate(formData);
		setFormData({ ...defaultData });
		// console.log('mutate with this formData:', formData); // Good for debugging
	};

	const handleEdit = (item: TenderItem) => {
		setEditingItem(item);
		setUpdateFormData(item);
	};

	const handleUpdate = (item: TenderItem) => {
		console.log('Editing item:', item);
		console.log('Editing item:', item);

		// Update the local items state
		setItems(
			tenderItems?.map((i) =>
				i.tenderItemId === editingItem?.tenderItemId ? updateFormData : i
			)
		);

		// Send the updated item to the server
		mutateUpdate(updateFormData);

		// Reset the editing state
		setEditingItem(null);
	};

	const finishDateStatus = handleFinishDate(tender?.finishDate);
	// const finishDateStatus = false;

	if (!tender) {
		return <p>No tender!</p>;
	}

	return (
		<Box backgroundColor={'white'} py={6} rounded={'md'}>
			<Flex justifyContent={'center'}>
				<Heading size={'md'}>Add items to Tender</Heading>
			</Flex>

			<VStack>
				<VStack mb={'4'}>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Description:
						</Text>
						<Text fontSize={'lg'}>{tender?.description}</Text>
					</HStack>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Terms:
						</Text>
						<Text fontSize={'lg'}>{tender?.terms}</Text>
					</HStack>
					<HStack>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							Status:
						</Text>
						<Text fontSize={'lg'}>
							{tender?.status === 1 ? 'Published' : 'Not published'}
						</Text>
					</HStack>
				</VStack>

				<HStack mb={'4'}>
					<VStack mr={'3'}>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Address:
							</Text>
							<Text fontSize={'lg'}>{tender?.address}</Text>
						</HStack>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Delivery:
							</Text>
							<Text fontSize={'lg'}>{handleDelivery}</Text>
						</HStack>
					</VStack>
					<Spacer />
					<VStack ml={'3'}>
						<Tooltip
							hasArrow
							label="You will not be able to answer offer until this date has passed"
						>
							<HStack>
								<Text fontWeight={'bold'} fontSize={'xl'}>
									Close Date:
								</Text>
								<Text fontSize={'lg'}>{formatDateWithoutTime(date)}*</Text>
							</HStack>
						</Tooltip>
						<HStack>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Phone:
							</Text>
							<Text fontSize={'lg'}>{tender?.phoneNumber}</Text>
						</HStack>
					</VStack>
				</HStack>
			</VStack>

			<Box px={10} py={4}>
				<Table variant={'striped'}>
					<Thead>
						<Tr>
							<Th width={'20%'}>
								<Tooltip hasArrow label="Cost Code">
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
								<Tooltip
									hasArrow
									label="Unit of measurement. For example: m2, kg, t"
								>
									<HStack>
										<Text>Unit</Text>
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
						{tenderItems?.length === 0 ? (
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
							{tenderItems?.map((item) => (
								<Tr key={item.tenderItemId}>
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
									{/* Action buttons */}
									<Td width={'20%'}>
										{editingItem === item ? (
											<HStack>
												<Button
													aria-label={'Update item'}
													onClick={() => handleUpdate(item)}
												>
													{isUpdateLoading ? (
														<LoadingSpinner />
													) : (
														'Update'
													)}
												</Button>
												<Button
													onClick={() => {
														setFormData({
															tenderId: Number(tenderId),
															description: '',
															nr: 0,
															volume: 0,
															unit: ''
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
															await deleteTenderItem(item);
															// console.log('Deleting item:', item); // Good for debugging
														}

														setDialogOpen(false);
														setFormData({
															tenderId: Number(tenderId),
															description: '',
															nr: 0,
															volume: 0,
															unit: ''
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

						{/* //! Maybe I'll add the status here instead? So I can make sure the Tender owner cannot add items after publishing */}
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
												type="text"
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
										{/* We only want the unit to be max 4 characters kg, m2, l, etc */}
										<FormControl id="unit" isInvalid={isInvalidUnit}>
											<Input
												htmlSize={4}
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
			</Box>
		</Box>
	);
};
