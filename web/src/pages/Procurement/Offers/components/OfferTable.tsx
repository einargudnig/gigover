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
import { Tender, TenderItem } from '../../../../models/Tender';
import { useTenderById } from '../../../../queries/useGetTenderById';
import { useParams } from 'react-router-dom';
import { OfferIdContext } from '../../../../context/OfferIdContext';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
// This is for the number!
import { useAddTenderItem } from '../../../../mutations/useAddTenderItem';

export function OfferTable() {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	// GET user tenders from database
	const { data: tenderData } = useTenderById(Number(tenderId));

	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;
	const [nrValue, setNrValue] = React.useState(0);
	const [costValue, setCostValue] = React.useState(0);
	const [notesValue, setNotesValue] = React.useState('');
	const { mutateAsync: addOfferItems } = useAddOfferItems();
	const { mutateAsync: addTenderItemNumber } = useAddTenderItem();

	const handleOfferItems = async (
		tenderItemId: number,
		offerId: number,
		cost?: number,
		notes?: string
	) => {
		const offerItemData = {
			tenderItemId,
			offerId,
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
		const { offerId } = useContext(OfferIdContext);

		return isEditing ? (
			<ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
				<IconButton
					aria-label="save"
					icon={<CheckIcon />}
					{...getSubmitButtonProps()}
					onClick={() => {
						handleOfferItems(
							tenderItemId,
							offerId,
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
									defaultValue={row?.nr?.toString() || 'no number'}
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
