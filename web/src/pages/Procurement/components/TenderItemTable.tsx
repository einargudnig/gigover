import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TenderItem } from '../../../models/Tender';
import { useAddTenderItem } from '../../../mutations/useAddTenderItem';
import { useModifyTenderItem } from '../../../mutations/useModifyTenderItem';
import { useDeleteTenderItem } from '../../../mutations/useDeleteTenderItem';
import { usePublishTender } from '../../../mutations/usePublishTender';
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
	Spacer,
	useToast
} from '@chakra-ui/react';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import ScrollIntoView from 'react-scroll-into-view'; // Nice for the UX, to scroll the edit form into view when pressing edit button
import { InviteButton } from './InviteButton';

export const TenderItemTable = ({ tender }): JSX.Element => {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	// console.log('tenderId', tenderId);

	const tenderDescForEmail = tender?.description;
	const tenderStatus = tender?.status;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	//! For now I'm only using this state variable for the updating of items. Since I had major issues with it I'm going to leave it like that!
	//eslint-disable-next-line
	const [items, setItems] = useState<TenderItem[] | undefined>(tenderItems || []);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<TenderItem | null>(null);
	const [formData, setFormData] = useState<TenderItem>({
		tenderId: Number(tenderId),
		description: 'Description',
		nr: 0,
		volume: 0,
		unit: 'Unit'
	});

	// POST / Update / DELETE
	const {
		mutate,
		isLoading: isMutateLoading,
		isError: isMutateError,
		error: mutateError
	} = useAddTenderItem();
	// eslint-disable-next-line
	const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useModifyTenderItem();
	const { mutateAsync: deleteTenderItem, isLoading: isDeleteLoading } = useDeleteTenderItem();
	const { mutateAsync: publishTender, isLoading: isPublishLoading } = usePublishTender(); // Publishing a tender

	const toast = useToast();

	//! We need to make a validation for the unit form field
	const isInvalidUnit = formData?.unit!.length > 5;

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

	// This works, It 'sends' the selected row to the edit form
	const handleEdit = (item: TenderItem) => {
		setEditingItem(item);
		setFormData({ ...item });
	};

	const handleUpdate = () => {
		setItems(
			tenderItems?.map((item) =>
				item.tenderItemId === editingItem?.tenderItemId ? { ...formData } : item
			)
		);

		mutateUpdate(formData);
		// console.log('Mutating tenderItem with this formData:', formData); // Good for debugging

		setEditingItem(null);
		setFormData({
			tenderId: Number(tenderId),
			description: '',
			nr: 0,
			volume: 0,
			unit: ''
		});
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
							<Td>{item.nr}</Td>
							<Td>{item.description}</Td>
							<Td>{item.volume}</Td>
							<Td>{item.unit}</Td>
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
				<FormControl id={'unit'} isInvalid={isInvalidUnit}>
					<FormLabel htmlFor="unit">Unit</FormLabel>
					<Input
						id="unit"
						name="unit"
						type="text"
						value={formData.unit}
						onChange={handleChange}
					/>
					{isInvalidUnit ? (
						<FormHelperText>
							The measurement of unit should be in a short format: kg, m, m2
						</FormHelperText>
					) : null}
				</FormControl>
			</Box>
			<br />
			<Flex justifyContent={'end'} mb={'6'}>
				<HStack>
					{tender === undefined ? null : editingItem ? (
						<HStack>
							<Button onClick={handleUpdate}>
								{isUpdateLoading ? <LoadingSpinner /> : 'Update item'}
							</Button>
							<ConfirmDialog
								header={'Delete item'}
								setIsOpen={setDialogOpen}
								callback={async (b) => {
									if (b) {
										await deleteTenderItem(editingItem);
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
									Cancel edit
								</Button>
								<Button
									aria-label={'Delete item'}
									colorScheme={'red'}
									isLoading={isDeleteLoading}
									leftIcon={<TrashIcon color={'white'} size={20} />}
									onClick={() => setDialogOpen(true)}
								>
									Delete
								</Button>
							</ConfirmDialog>
						</HStack>
					) : (
						<Button onClick={handleAdd}>
							{isMutateLoading ? <LoadingSpinner /> : 'Add item'}
						</Button>
					)}
				</HStack>
			</Flex>

			{/* onClick handler that publishes the tender
				// it also open a dialog where I can add email that I want to send an invitation to
			*/}
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
				<Button ml={'1'}>
					<Link to={`/tender-offers/${Number(tenderId)}`}>Published offers</Link>
				</Button>
			</Flex>
		</>
	);
};
