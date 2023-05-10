import React from 'react';
import { useParams } from 'react-router';
import {
	Button,
	ButtonGroup,
	Editable,
	EditableInput,
	EditablePreview,
	IconButton,
	Table,
	Td,
	Input,
	Th,
	Thead,
	Tr,
	Tooltip,
	useEditableControls,
	Divider,
	Box,
	Flex,
	HStack,
	VStack,
	Text,
	Tbody,
	useToast
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { GetOfferItem } from '../../../../models/Tender';
import { usePublishOffer } from '../../../../mutations/usePublishOffer';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
import { useAddTenderItem } from '../../../../mutations/useAddTenderItem'; // This is for the number attribute!

export const PublishedOffer = ({ offerId, offerData, isOfferLoading }): JSX.Element => {
	const { tenderId } = useParams();
	const [nrValue, setNrValue] = React.useState(0);
	const [costValue, setCostValue] = React.useState(0);
	const [notesValue, setNotesValue] = React.useState('');
	const { mutateAsync: addOfferItems } = useAddOfferItems();
	const { mutateAsync: addTenderItemNumber } = useAddTenderItem();

	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();
	const offer = offerData?.offer;
	const offerItems: GetOfferItem[] | undefined = offerData?.offer.items;

	const toast = useToast();

	const handleOfferItems = async (
		itemId: number,
		// eslint-disable-next-line no-shadow
		offerId: number,
		cost?: number,
		notes?: string
	): Promise<void> => {
		const offerItemData = {
			itemId,
			offerId: Number(offerId),
			...(cost && { cost }),
			...(notes && { notes })
		};
		await addOfferItems(offerItemData);
	};
	const tenderIdNr = Number(tenderId);

	const handleTenderItemNumber = async (
		tenderItemId: number,
		nr?: number,
		description?: string,
		volume?: number,
		unit?: string
	) => {
		const tenderItemData = {
			tenderId: tenderIdNr,
			tenderItemId,
			...(nr && { nr }),
			...(description && { description }),
			...(volume && { volume }),
			...(unit && { unit })
		};
		await addTenderItemNumber(tenderItemData);
	};

	const EditableControls = ({ tenderItemId }) => {
		const { isEditing, getSubmitButtonProps, getCancelButtonProps } = useEditableControls();

		return isEditing ? (
			<ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
				<IconButton
					aria-label="save"
					icon={<CheckIcon />}
					{...getSubmitButtonProps()}
					onClick={() => {
						if (Number(offerId) === 0) {
							toast({
								title: 'Error',
								description: 'There is no offer. This is an error.',
								status: 'error',
								duration: 5000,
								isClosable: true
							});
						}
						handleOfferItems(
							tenderItemId,
							Number(offerId),
							costValue || undefined,
							notesValue || undefined
						);
						handleTenderItemNumber(tenderItemId, nrValue || undefined);
					}}
				/>
				<IconButton
					aria-label="cancel"
					icon={<CloseIcon boxSize={3} />}
					{...getCancelButtonProps()}
				/>
			</ButtonGroup>
		) : null;
	};

	const handlePublish = () => {
		const offerIdBody = {
			offerId: Number(offerId)
		};

		publishOffer(offerIdBody);
		toast({
			title: 'Offer published',
			description: 'Your offer has been published!',
			status: 'success',
			duration: 3000,
			isClosable: true
		});
	};

	return (
		<>
			{isOfferLoading ? (
				<div>
					<LoadingSpinner />
				</div>
			) : (
				<>
					<div style={{ width: '100%' }}>
						<Flex direction={'column'}>
							<Box
								mb={2}
								p={4}
								borderRadius={8}
								borderColor={'#EFEFEE'}
								bg={'#EFEFEE'}
								w="100%"
							>
								<VStack pos={'relative'}>
									<VStack mb={'4'}>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Bidder Email:
											</Text>
											<Text fontSize={'lg'}>{offer?.email}</Text>
										</HStack>
										<HStack>
											<Text fontWeight={'bold'} fontSize={'xl'}>
												Tender Name:
											</Text>
											<Text fontSize={'lg'}>{offer?.name}</Text>
										</HStack>
									</VStack>

									<HStack mb={'4'}>
										<VStack mr={'3'}>
											<HStack>
												<Text fontWeight={'bold'} fontSize={'xl'}>
													Notes:
												</Text>
												<Text fontSize={'lg'}>{offer?.note}</Text>
											</HStack>
										</VStack>
									</HStack>
									<Divider />
								</VStack>
							</Box>
						</Flex>
					</div>

					<Table>
						<Thead>
							<Tr>
								<Tooltip label="Click to edit the number, this could be a product number">
									<Th>Number</Th>
								</Tooltip>

								<Tooltip label="Description of the items">
									<Th>Description</Th>
								</Tooltip>

								<Tooltip label="Volume, how many items">
									<Th>Volume</Th>
								</Tooltip>

								<Tooltip label="The measurement of unit for items">
									<Th>Unit</Th>
								</Tooltip>

								<Tooltip label="Click to edit the cost for items">
									<Th>Cost</Th>
								</Tooltip>

								<Tooltip label="Click to add any notes/certifications for the items.">
									<Th>Notes/Certifications</Th>
								</Tooltip>
							</Tr>
						</Thead>
						<Tbody>
							{offerItems?.map((row) => (
								<Tr key={row.tenderItemId}>
									<Td>
										<Editable
											defaultValue={row?.nr?.toString() || 'no number'}
											isPreviewFocusable={true}
											onSubmit={() => {
												console.log('submit number');
												console.log(nrValue);
											}}
											onChange={(value) => {
												setNrValue(Number(value));
											}}
										>
											<Tooltip label="Click to edit the number">
												<EditablePreview py={2} px={4} />
											</Tooltip>
											<HStack>
												<Input py={2} px={4} as={EditableInput} />
												<EditableControls tenderItemId={row.tenderItemId} />
											</HStack>
										</Editable>
									</Td>
									<Td>{row.description}</Td>
									<Td>{row.volume}</Td>
									<Td>{row.unit}</Td>
									<Td>
										<Editable
											defaultValue={row?.cost.toString()}
											isPreviewFocusable={true}
											selectAllOnFocus={true}
											onSubmit={() => {
												console.log('submit cost');
												console.log(costValue);
											}}
											onChange={(value) => {
												setCostValue(Number(value));
											}}
										>
											<Tooltip label="Click to edit the price">
												<EditablePreview py={2} px={4} />
											</Tooltip>
											<HStack>
												<Input
													py={2}
													px={4}
													as={EditableInput}
													placeholder="enter price"
												/>
												<EditableControls tenderItemId={row.tenderItemId} />
											</HStack>
										</Editable>
									</Td>
									<Td>
										<Editable
											defaultValue={row?.notes || 'no notes'}
											isPreviewFocusable={true}
											selectAllOnFocus={false}
											onSubmit={() => {
												console.log('submit notes');
												console.log(notesValue);
											}}
											onChange={(value) => {
												setNotesValue(value);
											}}
										>
											<Tooltip label="Click to edit notes">
												<EditablePreview py={2} px={4} />
											</Tooltip>
											<HStack>
												<Input py={2} px={4} as={EditableInput} />
												<EditableControls tenderItemId={row.tenderItemId} />
											</HStack>
										</Editable>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>

					<Text mt={'2'}>
						You can publish the offer again if you have made any updates to it.
					</Text>
					<Button onClick={handlePublish} mt={'2'}>
						{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer Again'}
					</Button>
				</>
			)}
		</>
	);
};
