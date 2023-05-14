import React, { useState } from 'react';
import {
	Button,
	Table,
	Tbody,
	Td,
	Input,
	Th,
	Thead,
	Tr,
	Tooltip,
	useToast
} from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';

export const NewOfferTable = ({ tenderItems }): JSX.Element => {
	const { offerId } = useParams();

	const [costValues, setCostValues] = useState(tenderItems.map(() => 0));
	const [notesValues, setNotesValues] = useState(tenderItems.map(() => 'no notes'));
	const { mutateAsync: addOfferItems } = useAddOfferItems();

	const toast = useToast();

	const handleOfferItems = async (tenderItemId: number, index: number) => {
		const offerItemData = {
			tenderItemId,
			offerId: Number(offerId),
			cost: costValues[index],
			notes: notesValues[index]
		};
		// console.log('offerItemData', { offerItemData });
		await addOfferItems(offerItemData);
		toast({
			title: 'Success',
			description: 'Item added to offer.',
			status: 'success',
			duration: 2000,
			isClosable: true
		});
	};

	const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newCostValues = [...costValues];
		newCostValues[index] = Number(event.target.value);
		setCostValues(newCostValues);
	};

	const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newNotesValues = [...notesValues];
		newNotesValues[index] = event.target.value;
		setNotesValues(newNotesValues);
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

						<Tooltip label="Click to add any notes/certifications for the items.">
							<Th>Action</Th>
						</Tooltip>
					</Tr>
				</Thead>
				<Tbody>
					{tenderItems?.map((row, index) => (
						<Tr key={row.tenderItemId}>
							<Td>{row.number}</Td>
							<Td>{row.description}</Td>
							<Td>{row.volume}</Td>
							<Td>{row.unit}</Td>
							<Td>
								<Input
									width={'45'}
									value={costValues[index]}
									onChange={(event) => handleCostChange(event, index)}
								/>
							</Td>
							<Td>
								<Input
									width={'45'}
									value={notesValues[index]}
									onChange={(event) => handleNotesChange(event, index)}
								/>
							</Td>
							<Td>
								<Button onClick={() => handleOfferItems(row.tenderItemId, index)}>
									Add item
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
};
