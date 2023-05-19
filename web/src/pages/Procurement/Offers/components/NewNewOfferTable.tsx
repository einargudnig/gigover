import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Button } from '@chakra-ui/react';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';

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

// interface TenderTableProps {
// 	tenderItems: TenderItem[];
// }

export const TenderTable = ({ tenderItems }): JSX.Element => {
	const { offerId } = useParams();
	const [items, setItems] = useState<TenderItem[]>(tenderItems);

	const {
		mutateAsync: addOfferItems
		// isLoading: addOfferItemsLoading,
		// isError: isMutateError,
		// error: mutateError
	} = useAddOfferItems();

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
			tenderItemId: items[index].tenderItemId,
			productNumber: items[index].productNumber,
			cost: items[index].cost,
			notes: items[index].note
		};

		// Here, you can add a call to your database API to persist the changes
		// For example:
		addOfferItems(offerItemBody).then(() => console.log('Item updated!'));
	};

	return (
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
						<Th>Notes</Th>
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
									value={item.productNumber || ''}
									onChange={(e) =>
										updateItem(index, 'productNumber', e.target.value)
									}
								/>
							</Td>
							<Td>
								<Input
									type="number"
									value={item.cost || 0}
									onChange={(e) =>
										updateItem(index, 'cost', Number(e.target.value))
									}
								/>
							</Td>
							<Td>
								<Input
									value={item.note || ''}
									onChange={(e) => updateItem(index, 'note', e.target.value)}
								/>
							</Td>
							<Td>
								<Button onClick={() => handleUpdateClick(index)}>Update</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
