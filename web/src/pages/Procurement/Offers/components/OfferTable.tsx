import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Button, useToast } from '@chakra-ui/react';
import { useAddOfferItems } from '../../../../mutations/useAddOfferItems';
// import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
// import { GetOfferItem } from '../../../../models/Tender';
// import { LoadingSpinner } from '../../../../components/LoadingSpinner';

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

export const TenderTable = ({ tenderItems }): JSX.Element => {
	const { offerId } = useParams();
	const [items, setItems] = useState<TenderItem[]>(tenderItems);
	// const { data: offerData, isLoading: isOfferLoading } = useGetOfferByOfferId(Number(offerId));

	const {
		mutateAsync: addOfferItems
		// isLoading: addOfferItemsLoading
		// isError: isMutateError,
		// error: mutateError
	} = useAddOfferItems();

	const toast = useToast();

	const updateItem = (
		index: number,
		field: 'productNumber' | 'cost' | 'note',
		value: string | number
	) => {
		setItems((prevItems) =>
			prevItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
		);
	};

	const handleUpdateClick = (index: number) => {
		const itemToUpdate = items[index];
		const offerItemBody = {
			offerId: Number(offerId),
			itemId: itemToUpdate.tenderItemId,
			productNumber: itemToUpdate.productNumber,
			cost: itemToUpdate.cost,
			note: itemToUpdate.note
		};

		console.log('offerItemBody', offerItemBody);

		addOfferItems(offerItemBody).then(() => console.log('Item updated!'));
		toast({
			title: 'Success',
			description: 'Item added to offer.',
			status: 'success',
			duration: 2000,
			isClosable: true
		});
	};

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const removeFormat = (str: string) => {
		return Number(str.replace(/\./g, ''));
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
						<Th>Cost pr item</Th>
						<Th>Notes/Certifications</Th>
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
									htmlSize={6}
									width={'auto'}
									value={item.productNumber || ''}
									onChange={(e) =>
										updateItem(index, 'productNumber', e.target.value)
									}
								/>
							</Td>
							<Td>
								<Input
									htmlSize={6}
									width={'auto'}
									type="text"
									value={item.cost ? formatNumber(item.cost) : ''}
									onChange={(e) =>
										updateItem(index, 'cost', removeFormat(e.target.value))
									}
								/>
							</Td>
							<Td>
								<Input
									htmlSize={10}
									width={'auto'}
									value={item.note || ''}
									onChange={(e) => updateItem(index, 'note', e.target.value)}
								/>
							</Td>
							<Td>
								<Button onClick={() => handleUpdateClick(index)}>
									{/* Decided to change this. Instead of having *all* loading spinners showing when adding items I have the toast for the UI/UX */}
									{/* It would be very cool to be able to only make one of the loading spinners spin */}
									{/* {addOfferItemsLoading ? <LoadingSpinner /> : 'Update'} */}
									Update
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
