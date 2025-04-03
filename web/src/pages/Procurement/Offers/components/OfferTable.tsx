import { Box, Button, Input, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAddOfferItems } from '../../../../mutations/procurement/useAddOfferItems';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';

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

	const {
		mutateAsync: addOfferItems,
		// isLoading: addOfferItemsLoading,
		// isError: isMutateError,
		error: mutateError
	} = useAddOfferItems();

	const { data: offerData } = useGetOfferByOfferId(Number(offerId));

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
	};

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const removeFormat = (str: string) => {
		return Number(str.replace(/\./g, ''));
	};

	const isItemInOffer = (tenderItemId: number) => {
		return offerData && offerData.offer && offerData.offer.items
			? offerData.offer.items.some((item) => item.tenderItemId === tenderItemId)
			: false;
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
						{/* <Th>Product Number</Th> */}
						<Th>Cost pr item</Th>
						<Th>Notes/Certifications/GWP</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{items.map((item, index) => {
						const offerItem = isItemInOffer(item.tenderItemId)
							? offerData?.offer.items.find(
									(oi) => oi.tenderItemId === item.tenderItemId
							  )
							: null;

						return (
							<Tr key={item.tenderItemId}>
								<Td>{item.nr}</Td>
								<Td>{item.description}</Td>
								<Td>{item.unit}</Td>
								<Td>{item.volume}</Td>
								<Td>
									{offerItem?.cost ? (
										formatNumber(offerItem.cost)
									) : (
										<Input
											htmlSize={6}
											borderColor={'gray.400'}
											placeholder="cost"
											width={'auto'}
											type="text"
											value={item.cost ? formatNumber(item.cost) : ''}
											onChange={(e) =>
												updateItem(
													index,
													'cost',
													removeFormat(e.target.value)
												)
											}
										/>
									)}
								</Td>
								<Td>
									{offerItem?.note || (
										<Input
											htmlSize={10}
											borderColor={'gray.400'}
											placeholder="note"
											width={'auto'}
											value={item.note || ''}
											onChange={(e) =>
												updateItem(index, 'note', e.target.value)
											}
										/>
									)}
								</Td>
								<Td>
									<Button
										variant={'outline'}
										colorScheme={'black'}
										onClick={() => handleUpdateClick(index)}
									>
										Update
									</Button>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			{mutateError && <p>{mutateError.message}</p>}
		</Box>
	);
};
