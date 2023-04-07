import React from 'react';
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
	Text,
	Th,
	Thead,
	Tr,
	Tooltip,
	useEditableControls,
	HStack
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { TenderItem } from '../../../../models/Tender';
import { useParams } from 'react-router-dom';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
import { useAddTenderItem } from '../../../../mutations/useAddTenderItem'; // This is for the number attribute!

export const OfferTableHome = ({ tender }): JSX.Element => {
	const { tenderId } = useParams();
	const { offerId: offerIdFromCtxt } = useParams();

	const tenderItems: TenderItem[] | undefined = tender?.items;
	const [nrValue, setNrValue] = React.useState(0);
	const [costValue, setCostValue] = React.useState(0);
	const [notesValue, setNotesValue] = React.useState('');
	const { mutateAsync: addOfferItems } = useAddOfferItems();
	const { mutateAsync: addTenderItemNumber } = useAddTenderItem();
	// console.log(offerIdFromCtxt); // This is of course 0 when I 'start' the server. But how persistent is this value?

	const handleOfferItems = async (
		tenderItemId: number,
		offerId: number,
		cost?: number,
		notes?: string
	) => {
		const offerItemData = {
			tenderItemId,
			offerId: Number(offerIdFromCtxt),
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
						if (Number(offerIdFromCtxt) === 0) {
							alert(
								'Are your sure you have opened the offer? You have to open the offer before you can publish it.'
							);
						}
						handleOfferItems(
							tenderItemId,
							Number(offerIdFromCtxt),
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
			<Text my={'2'}>
				This is the tender you have been invited to make an offer to. You have to open an
				offer to be able to add you product numbers, costs and notes.
			</Text>
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
							<Td>no number</Td>
							<Td>{row.description}</Td>
							<Td>{row.volume}</Td>
							<Td>{row.unit}</Td>
							<Td>no cost</Td>
							<Td>no notes</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			<Text mt={'2'}>
				If you have already made an offer for this tender and you want to update it, you can
				see your offers by pressing this button.
			</Text>
			<Button mt={'2'}>
				<Link to={'/bidder-offers'}>Go to my Offers</Link>
			</Button>
		</>
	);
};
