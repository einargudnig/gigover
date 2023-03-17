import React, { useState, useContext } from 'react';
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
import { Tender, TenderItem } from '../../../../models/Tender';
import { useTenderById } from '../../../../queries/useGetTenderById';
import { useParams } from 'react-router-dom';
import { OfferIdContext } from '../../../../context/OfferIdContext';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';

interface Props {
	onUpdateRow: (updatedRow: TenderItem) => void;
}

// function EditableControls() {
// 	const { isEditing, getSubmitButtonProps, getCancelButtonProps } = useEditableControls();
// 	const { offerId } = useContext(OfferIdContext);
// 	// const { mutate: addOfferItems } = useAddOfferItems();

// 	//! I should trigger the mutation in the onClick handler for the submit button!
// 	// That allows me to even trigger two mutations, the number and the notes/cost.
// 	return isEditing ? (
// 		<ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
// 			<IconButton
// 				aria-label="save"
// 				icon={<CheckIcon />}
// 				{...getSubmitButtonProps()}
// 				onClick={() => {
// 					console.log(
// 						`This should trigger a mutation, with the offerId ${offerId} from the context`
// 					);

// 					// addOfferItems({ offerId, items: [] })
// 				}}
// 			/>
// 			<IconButton
// 				aria-label="cancel"
// 				icon={<CloseIcon boxSize={3} />}
// 				{...getCancelButtonProps()}
// 			/>
// 		</ButtonGroup>
// 	) : null;
// }

export function OfferTable() {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	// GET user tenders from database
	const { data: tenderData } = useTenderById(Number(tenderId));
	//! This will cause me annoying trouble that I have to deal with
	// Fx, when I want to modify or delete items they can be undefined, which is no bueno.
	// There is a way around this, but it's not pretty.
	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const [costValue, setCostValue] = React.useState(0);
	const [notesValue, setNotesValue] = React.useState('');

	const EditableControls = ({ tenderItemId }) => {
		const { isEditing, getSubmitButtonProps, getCancelButtonProps } = useEditableControls();
		const { offerId } = useContext(OfferIdContext);
		const { mutateAsync: addOfferItems } = useAddOfferItems();

		//! I should trigger the mutation in the onClick handler for the submit button!
		// That allows me to even trigger two mutations, the number and the notes/cost.
		return isEditing ? (
			<ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
				<IconButton
					aria-label="save"
					icon={<CheckIcon />}
					{...getSubmitButtonProps()}
					onClick={() => {
						console.log(
							`This should trigger a mutation, with the offerId ${offerId} from the context`
						);

						addOfferItems({
							tenderItemId,
							offerId,
							cost: costValue,
							notes: notesValue
						});
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

	return (
		<>
			<Table>
				<Thead>
					<Tr>
						<Th>Number</Th>
						<Th>Description</Th>
						<Th>Volume</Th>
						<Th>Unit</Th>
						<Th>Cost</Th>
						<Th>Notes</Th>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((row) => (
						<Tr key={row.tenderItemId}>
							<Td>
								<Editable
									defaultValue={row.nr.toString()}
									isPreviewFocusable={true}
									selectAllOnFocus={false}
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
									// defaultValue={row?.cost.toString()}
									defaultValue={'no price'}
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
										<Input py={2} px={4} as={EditableInput} />
										<EditableControls tenderItemId={row.tenderItemId} />
									</HStack>
								</Editable>
							</Td>
							<Td>
								<Editable
									defaultValue={row.notes}
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

			<Button>Publish Offer</Button>
		</>
	);
}
