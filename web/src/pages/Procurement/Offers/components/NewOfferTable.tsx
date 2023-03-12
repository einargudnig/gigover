import React, { useState } from 'react';
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
	useColorModeValue
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Tender, TenderItem } from '../../../../models/Tender';
import { useTenderById } from '../../../../queries/useGetTenderById';
import { useParams } from 'react-router-dom';

interface Props {
	onUpdateRow: (updatedRow: TenderItem) => void;
}

function EditableControls() {
	const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
		useEditableControls();

	return isEditing ? (
		<ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
			<IconButton aria-label="save" icon={<CheckIcon />} {...getSubmitButtonProps()} />
			<IconButton
				aria-label="cancel"
				icon={<CloseIcon boxSize={3} />}
				{...getCancelButtonProps()}
			/>
		</ButtonGroup>
	) : null;
}

export function NewOfferTable() {
	const { tenderId } = useParams(); //! Cast to NUMBER(tenderId)
	// GET user tenders from database
	const { data: tenderData } = useTenderById(Number(tenderId));
	//! This will cause me annoying trouble that I have to deal with
	// Fx, when I want to modify or delete items they can be undefined, which is no bueno.
	// There is a way around this, but it's not pretty.
	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const handleUpdateRow = (updatedRow: TenderItem) => {
		// onUpdateRow(updatedRow);
		console.log(updatedRow);
	};

	return (
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
								<Input py={2} px={4} as={EditableInput} />
								<EditableControls />
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
							>
								<Tooltip label="Click to edit the price">
									<EditablePreview py={2} px={4} />
								</Tooltip>
								<Input py={2} px={4} as={EditableInput} />
								<EditableControls />
							</Editable>
						</Td>
						<Td>
							<Editable
								defaultValue={row.notes}
								isPreviewFocusable={true}
								selectAllOnFocus={false}
							>
								<Tooltip label="Click to edit notes">
									<EditablePreview py={2} px={4} />
								</Tooltip>
								<Input py={2} px={4} as={EditableInput} variant={'filled'} />
								<EditableControls />
							</Editable>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
}
