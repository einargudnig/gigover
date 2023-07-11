import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
	Box,
	Text,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Input,
	Button,
	useToast,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Center,
	HStack
} from '@chakra-ui/react';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { VerticalDots } from '../../../../components/icons/VerticalDots';
import { UploadIcon } from '../../../../components/icons/UploadIcon';
import { FolderIcon } from '../../../../components/icons/FolderIcon';
import { UploadCertifications } from './UploadCertifications';

interface TenderItem {
	description: string;
	nr: number;
	tenderItemId: number;
	unit: string;
	volume: number;
	productNumber?: string;
	cost?: number;
	note?: string;
}

export const TenderTable = ({ tenderItems }): JSX.Element => {
	const { offerId } = useParams();
	const { tenderId } = useParams();
	const [items, setItems] = useState<TenderItem[]>(tenderItems);
	const [upload, setUpload] = useState(false);

	const {
		mutateAsync: addOfferItems,
		isLoading: addOfferItemsLoading
		// isError: isMutateError,
		// error: mutateError
	} = useAddOfferItems();

	const toast = useToast();

	const updateItem = (
		index: number,
		field: 'productNumber' | 'cost' | 'note',
		value: string | number
	) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		setItems(newItems);
	};

	const handleUpdateClick = (index: number) => {
		const offerItemBody = {
			offerId: Number(offerId),
			itemId: items[index].tenderItemId,
			productNumber: items[index].productNumber,
			cost: items[index].cost,
			note: items[index].note
		};

		console.log('offerItemBody', offerItemBody);

		// Here, you can add a call to your database API to persist the changes
		// For example:
		addOfferItems(offerItemBody).then(() => console.log('Item updated!'));
		toast({
			title: 'Success',
			description: 'Item added to offer.',
			status: 'success',
			duration: 2000,
			isClosable: true
		});
	};

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const removeFormat = (str: string) => {
		return Number(str.replace(/\./g, ''));
	};

	return (
		<>
			{upload && (
				<UploadCertifications
					onClose={() => {
						setUpload(false);
					}}
					onComplete={(status) => {
						// devInfo('status', status);
						console.log('status', status);
					}}
					offerId={Number(offerId)}
					tenderId={Number(tenderId)}
				/>
			)}
			<Box w="100%" p={4}>
				<Table>
					<Thead>
						<Tr>
							<Th>Nr</Th>
							<Th>Description</Th>
							<Th>Unit</Th>
							<Th>Volume</Th>
							<Th>Product Number</Th>
							<Th>Cost</Th>
							<Th>Notes/Certifications</Th>
							<Th>Files</Th>
							<Th>Action</Th>
						</Tr>
					</Thead>
					<Tbody>
						{items.map((item, index) => (
							<Tr key={item.tenderItemId}>
								<Td>{item.nr}</Td>
								<Td>{item.description}</Td>
								<Td>{item.unit}</Td>
								<Td>{item.volume}</Td>
								<Td>
									<Input
										htmlSize={6}
										width={'auto'}
										value={item.productNumber || ''}
										onChange={(e) =>
											updateItem(index, 'productNumber', e.target.value)
										}
									/>
								</Td>
								<Td>
									<Input
										htmlSize={6}
										width={'auto'}
										type="text"
										value={item.cost ? formatNumber(item.cost) : ''}
										onChange={(e) =>
											updateItem(index, 'cost', removeFormat(e.target.value))
										}
									/>
								</Td>
								<Td>
									<Input
										htmlSize={10}
										width={'auto'}
										value={item.note || ''}
										onChange={(e) => updateItem(index, 'note', e.target.value)}
									/>
								</Td>
								<Td>
									<Center>
										<Menu>
											<MenuButton
												as={Button}
												aria-label="More Actions"
												size="sm"
												color={'black'}
											>
												<VerticalDots />
											</MenuButton>
											<MenuList>
												<MenuGroup title="Actions">
													<MenuItem
														marginBottom={'1'}
														onClick={() => setUpload(true)}
													>
														<Text color={'black'} mr={'2'}>
															Upload certification
														</Text>
														<UploadIcon />
													</MenuItem>
													<MenuItem>
														{/* <Link to={`/files/tender/${offerId}`}> */}
														<Link to={'/files/tender'}>
															<HStack>
																<Text color={'black'} mr={'2'}>
																	View certifications
																</Text>
																<FolderIcon type={'medium'} />
															</HStack>
														</Link>
													</MenuItem>
												</MenuGroup>
											</MenuList>
										</Menu>
									</Center>
								</Td>
								<Td>
									<Button onClick={() => handleUpdateClick(index)}>
										{addOfferItemsLoading ? <LoadingSpinner /> : 'Update'}
									</Button>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
		</>
	);
};
