import React from 'react';
import {
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
	HStack,
	useToast
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { useParams } from 'react-router-dom';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
import { useAddTenderItem } from '../../../../mutations/useAddTenderItem'; // This is for the number attribute!

export const OfferTable = ({ tenderItems }): JSX.Element => {
	const { tenderId } = useParams();
	const { offerId } = useParams();

	const [nrValue, setNrValue] = React.useState(0);
	const [costValue, setCostValue] = React.useState(0);
	const [notesValue, setNotesValue] = React.useState('');
	const { mutateAsync: addOfferItems } = useAddOfferItems();
	const { mutateAsync: addTenderItemNumber } = useAddTenderItem();

	const toast = useToast();

	const handleOfferItems = async (
		tenderItemId: number,
		// eslint-disable-next-line no-shadow
		offerId: number,
		cost?: number,
		notes?: string
	): Promise<void> => {
		const offerItemData = {
			tenderItemId,
			offerId: Number(offerId),
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
									defaultValue={row?.nr?.toString() || 'no number'}
									isPreviewFocusable={true}
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
		</>
	);
};
