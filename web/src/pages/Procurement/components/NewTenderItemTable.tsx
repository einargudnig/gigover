import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TenderItem } from '../../../models/Tender';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
import { useModifyTenderItem } from '../../../mutations/useModifyTenderItem';
import { useDeleteTenderItem } from '../../../mutations/useDeleteTenderItem';
import { usePublishTender } from '../../../mutations/usePublishTender';
import {
	Button,
	Box,
	Flex,
	FormControl,
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
	Spacer,
	useToast
} from '@chakra-ui/react';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { Edit } from '../../../components/icons/Edit';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import { CrossIcon } from '../../../components/icons/CrossIcon';
import { InviteButton } from './InviteButton';
import { UploadTenderDocuments } from '../Offers/components/UploadTenderDocuments';

export const NewTenderItemTable = ({ tender }): JSX.Element => {
	const { tenderId } = useParams();

	const defaultData: TenderItem = {
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit'
	};

	const tenderDescForEmail = tender?.description;
	const tenderStatus = tender?.status;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const [upload, setUpload] = useState(false); // for the uploadModal

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
	const { mutateAsync: publishTender, isLoading: isPublishLoading } = usePublishTender(); // Publishing a tender

	const toast = useToast();

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

	const handlePublish = async () => {
		const publishTenderBody = {
			tenderId: Number(tenderId)
		};
		if (tender !== undefined) {
			try {
				await publishTender(publishTenderBody);
				toast({
					title: 'Tender published',
					description: 'Now you can invite people to send offers to your tender!',
					status: 'success',
					duration: 2000,
					isClosable: true
				});
			} catch (error) {
				// console.log('ERROR', { error });
				toast({
					title: 'Error',
					description: 'Something went wrong when we tried to publish your tender.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		} else {
			toast({
				title: 'Error',
				description: 'Something went wrong when we tried to publish your tender.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	const finishDateStatus = handleFinishDate(tender?.finishDate);
	// const finishDateStatus = false;

	return (
		<>
			{upload && (
				<UploadTenderDocuments
					onClose={() => setUpload(false)}
					onComplete={(status) => {
						console.log('status', status);
					}}
					tenderId={Number(tenderId)}
				/>
			)}

			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Th width={'20%'}>
							<HStack>
								<Text>Number</Text>
								<ImportantIcon size={20} />
							</HStack>
						</Th>

						<Tooltip label="Description of a item">
							<Th width={'20%'}>
								<HStack>
									<Text>Description</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Volume">
							<Th width={'20%'}>
								<HStack>
									<Text>Volume</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

						<Tooltip label="Unit of measurement. For example: m2, kg, t">
							<Th width={'20%'}>
								<HStack>
									<Text>Unit</Text>
									<ImportantIcon size={20} />
								</HStack>
							</Th>
						</Tooltip>

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
												{isUpdateLoading ? <LoadingSpinner /> : 'Update'}
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
												The measurement of unit should be in a short format:
												kg, m, m2
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

			<br />

			<Flex alignItems={'center'} justifyContent={'center'}>
				<Flex alignItems={'center'} justifyContent={'center'}>
					{!finishDateStatus ? (
						<>
							{tenderStatus === 0 ? (
								<Button onClick={handlePublish} mr={'2'}>
									{isPublishLoading ? <LoadingSpinner /> : 'Publish Tender'}
								</Button>
							) : (
								<Text mr={'2'}>You have already published the Tender</Text>
							)}
							{tenderStatus === 1 ? (
								<InviteButton tenderId={tenderId} tenderDesc={tenderDescForEmail} />
							) : (
								<Text>
									You need to publish the tender before you can invite people
								</Text>
							)}
						</>
					) : (
						<Flex alignItems={'center'} justifyContent={'center'}>
							<Text>The finish date has passed, you can not publish the tender.</Text>
						</Flex>
					)}
				</Flex>
				<Spacer />
				{/* This button is for the tenderOwner to go to the offerPage */}
				<Flex>
					<Box>
						<Button ml={'1'}>
							<Link to={`../../files/tender/tenders/${Number(tenderId)}`}>
								View files from offers
							</Link>
						</Button>
					</Box>
					<Spacer />

					<Box>
						<Button onClick={() => setUpload(true)} ml={'1'}>
							Upload files
						</Button>
					</Box>
					<Spacer />
					<Box>
						<Button ml={'1'}>
							<Link to={`/tender/tender-offer/${Number(tenderId)}`}>
								Published offers
							</Link>
						</Button>
					</Box>
				</Flex>
			</Flex>
		</>
	);
};
