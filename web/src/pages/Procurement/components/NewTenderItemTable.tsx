import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TenderItem } from '../../../models/Tender';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
import { useModifyTenderItem } from '../../../mutations/useModifyTenderItem';
import { useDeleteTenderItem } from '../../../mutations/useDeleteTenderItem';
import { usePublishTender } from '../../../mutations/usePublishTender';
import {
	Button,
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

export const NewTenderItemTable = ({ tender }): JSX.Element => {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)

	const tenderDescForEmail = tender?.description;
	const tenderStatus = tender?.status;
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

	const isInvalidUnit = formData?.unit!.length > 5;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	// ! This guy is good to go! -> He works the way we want him to.
	const handleAdd = () => {
		// setItems([...[items], formData]); //! I think this is not needed
		setFormData({
			tenderId: Number(tenderId),
			description: formData.description,
			nr: formData.nr,
			volume: formData.volume,
			unit: formData.unit
		});

		mutate(formData);
		setFormData({
			tenderId: Number(tenderId),
			description: 'Description',
			nr: 0,
			volume: 0,
			unit: 'Unit'
		});
		// console.log('mutate with this formData:', formData); // Good for debugging
	};

	const handleEdit = (item: TenderItem) => {
		setEditingItem(item);
		// setFormData({ ...item });
	};

	const handleUpdate = (item: TenderItem) => {
		setEditingItem(item);
		console.log('Editing row:', editingItem);
		setItems(
			tenderItems?.map((i) =>
				i.tenderItemId === editingItem?.tenderItemId ? { ...formData } : i
			)
		);

		mutateUpdate(formData);
		// console.log('Mutating tenderItem with this formData:', formData); // Good for debugging

		setEditingItem(null);
		// setFormData({
		// 	tenderId: Number(tenderId),
		// 	description: '',
		// 	nr: 0,
		// 	volume: 0,
		// 	unit: ''
		// });
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

	return (
		<>
			<Table variant={'striped'}>
				<Thead>
					<Tr>
						<Tooltip label="Does this item have a special number?">
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

						<Th>
							<p>Actions</p>
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((item) => (
						<Tr key={item.tenderItemId}>
							<Td>
								{editingItem === item ? (
									<Input name="nr" value={item.nr} onChange={handleChange} />
								) : (
									item.nr
								)}
							</Td>
							<Td>
								{editingItem === item ? (
									<Input
										name="description"
										value={item.description}
										onChange={handleChange}
									/>
								) : (
									item.description
								)}
							</Td>
							<Td>
								{editingItem === item ? (
									<Input
										name="volume"
										value={item.volume}
										onChange={handleChange}
									/>
								) : (
									item.volume
								)}
							</Td>
							<Td>
								{editingItem === item ? (
									<Input name="unit" value={item.unit} onChange={handleChange} />
								) : (
									item.unit
								)}
							</Td>
							{/* Action buttons */}
							<Td>
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
					<Text>Enter details below to add items to tender</Text>
					<Tr>
						<Td>
							<FormControl id="nr">
								<Input
									id="nr"
									name="nr"
									type="number"
									value={formData.nr}
									onChange={handleChange}
								/>
							</FormControl>
						</Td>
						<Td>
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
						<Td>
							<FormControl id="volume">
								<Input
									id="volume"
									name="volume"
									type="text"
									value={formData.volume}
									onChange={handleChange}
								/>
							</FormControl>
						</Td>
						<Td>
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
										The measurement of unit should be in a short format: kg, m,
										m2
									</FormHelperText>
								) : null}
							</FormControl>
						</Td>
						<Td>
							<Button onClick={handleAdd}>
								{isMutateLoading ? <LoadingSpinner /> : 'Add item'}
							</Button>
						</Td>
					</Tr>

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
							<Text fontSize={'xs'} marginRight={'2'}>
								The finish date has passed, you can not publish the tender.
							</Text>
							{/* Maybe I end up removing this? Should the tender owner be able to invite users after the finishDate is passed? */}
							{tenderStatus === 1 ? (
								<InviteButton tenderId={tenderId} tenderDesc={tenderDescForEmail} />
							) : (
								<Text>
									You need to publish the tender before you can invite people
								</Text>
							)}
						</Flex>
					)}
				</Flex>
				<Spacer />
				{/* This button is for the tenderOwner to go to the offerPage */}
				<Button mr={'1'}>
					<Link to={`/files/tender/tenders/${Number(tenderId)}`}>Tender files</Link>
				</Button>
				<Button ml={'1'}>
					<Link to={`/tender-offers/${Number(tenderId)}`}>Published offers</Link>
				</Button>
			</Flex>
		</>
	);
};
