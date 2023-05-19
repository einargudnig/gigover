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

	const [productNrValues, setProductNrValues] = useState(tenderItems.map(() => 'number'));
	const [costValues, setCostValues] = useState(tenderItems.map(() => 0));
	const [notesValues, setNotesValues] = useState(tenderItems.map(() => 'no notes'));

	const { mutateAsync: addOfferItems } = useAddOfferItems();

	const toast = useToast();

	const handleOfferItems = async (tenderItemId: number, index: number) => {
		const offerItemData = {
			tenderItemId,
			offerId: Number(offerId),
			productNr: productNrValues[index],
			cost: costValues[index],
			note: notesValues[index]
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

	const handleProductNrChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newProductNrValues = [...productNrValues];
		newProductNrValues[index] = event.target.value;
		setProductNrValues(newProductNrValues);
	};

	const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newCostValues = [...costValues];
		newCostValues[index] = Number(event.target.value);
		console.log('newCostValues', newCostValues);
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
						<Tooltip label="Number">
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
							<Th>Product number</Th>
						</Tooltip>

						<Tooltip label="Click to edit the cost for items">
							<Th>Cost pr. item</Th>
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
									rounded={'md'}
									size={'sm'}
									htmlSize={6}
									width={'auto'}
									value={productNrValues[index]}
									onChange={(event) => handleProductNrChange(event, index)}
								/>
							</Td>
							<Td>
								<Input
									rounded={'md'}
									size={'sm'}
									htmlSize={5}
									width={'auto'}
									value={costValues[index]}
									onChange={(event) => handleCostChange(event, index)}
								/>
							</Td>
							<Td>
								<Input
									rounded={'md'}
									size={'sm'}
									htmlSize={10}
									width={'auto'}
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
