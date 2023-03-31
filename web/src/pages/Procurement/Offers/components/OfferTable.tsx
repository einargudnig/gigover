import React, { useContext } from 'react';
import {
	Button,
	ButtonGroup,
	Editable,
	EditableInput,
	EditablePreview,
	IconButton,
	Table,
	Tbody,
	Td,
	Input,
	Th,
	Thead,
	Tr,
	Tooltip,
	useEditableControls,
	HStack
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { TenderItem } from '../../../../models/Tender';
import { useParams } from 'react-router-dom';
import { OfferIdContext } from '../../../../context/OfferIdContext';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
import { useAddTenderItem } from '../../../../mutations/useAddTenderItem'; // This is for the number attribute!
import { usePublishOffer } from '../../../../mutations/usePublishOffer';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const OfferTable = ({ tender }): JSX.Element => {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	// GET user tenders from database

	const tenderItems: TenderItem[] | undefined = tender?.items;
	const [nrValue, setNrValue] = React.useState(0);
	const [costValue, setCostValue] = React.useState(0);
	const [notesValue, setNotesValue] = React.useState('');
	const { mutateAsync: addOfferItems } = useAddOfferItems();
	const { mutateAsync: addTenderItemNumber } = useAddTenderItem();
	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();
	const { offerId: offerIdFromCtxt } = useContext(OfferIdContext);
	// console.log(offerIdFromCtxt); // This is of course 0 when I 'start' the server. But how persistent is this value?

	// const { data } = useGetOfferByOfferId(51);
	// console.log('Data', { data });
	// const offer = data?.offer;
	// console.log('Offer', { offer });

	const handleOfferItems = async (
		tenderItemId: number,
		offerId: number,
		cost?: number,
		notes?: string
	) => {
		const offerItemData = {
			tenderItemId,
			offerId: offerIdFromCtxt,
			...(cost && { cost }),
			...(notes && { notes })
		};
		await addOfferItems(offerItemData);
	};

	// This is somewhat hacky..
	// I want to let the offerer add the number of the tender item.
	// he/she might want to add a product number or something like that.
	// That means that I need to add these optional dynamic parameters to the mutation.
	// Maybe I'll come back alter and do this better 🤷‍♂️, but I think will be fine for the time being.
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
						if (offerIdFromCtxt === 0) {
							alert(
								'Are your sure you have opened the offer? You have to open the offer before you can publish it.'
							);
						}
						handleOfferItems(
							tenderItemId,
							offerIdFromCtxt,
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
		if (offerIdFromCtxt === 0) {
			alert(
				'Are your sure you have opened the offer? You have to open the offer before you can publish it.'
			);
		}
		const offerIdBody = {
			offerId: offerIdFromCtxt
		};
		publishOffer(offerIdBody);
		alert('You have published the offer!');
	};

	return (
		<>
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
					{tenderItems?.map((row) => (
						<Tr key={row.tenderItemId}>
							<Td>
								<Editable
									// defaultValue={row?.nr?.toString() || 'no number'}
									defaultValue="no number"
									isPreviewFocusable={true}
									selectAllOnFocus={false}
									onSubmit={() => {
										console.log('submit');
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
									defaultValue={row?.cost?.toString() || 'no cost'}
									isPreviewFocusable={true}
									selectAllOnFocus={false}
									onSubmit={() => {
										console.log('submit');
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
									defaultValue={row.notes || 'no notes'}
									isPreviewFocusable={true}
									selectAllOnFocus={false}
									onSubmit={() => {
										console.log('submit');
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

			<Button onClick={handlePublish}>
				{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'}
			</Button>
		</>
	);
};
