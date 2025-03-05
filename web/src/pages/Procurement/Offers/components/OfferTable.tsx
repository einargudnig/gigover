import { Box, Button, Input, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAddOfferItems } from '../../../../mutations/procurement/useAddOfferItems';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
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

	const {
		mutateAsync: addOfferItems,
		// isLoading: addOfferItemsLoading
		// isError: isMutateError,
		error: mutateError
	} = useAddOfferItems();

	const { data: offerData } = useGetOfferByOfferId(Number(offerId));

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

	// function that adds the total cost of all items in the offer
	const totalCost = () => {
		let total = 0;
		offerData?.offer.items.forEach((item) => {
			// eslint-disable-next-line
			total += item.cost * item.volume;
		});
		return total;
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
						<Th>Notes/Certifications</Th>
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
								{/* <Td>
									{offerItem?.productNumber || (
										<Input
											htmlSize={6}
											width={'auto'}
											value={item.productNumber || ''}
											onChange={(e) =>
												updateItem(index, 'productNumber', e.target.value)
											}
										/>
									)}
								</Td> */}
								<Td>
									{offerItem?.cost ? (
										formatNumber(offerItem.cost)
									) : (
										<Input
											htmlSize={6}
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
					<Tr>
						<Td></Td>
						<Td></Td>
						<Td></Td>
						<Td>
							<strong>Total cost:</strong>
						</Td>
						<Td>{formatNumber(totalCost())}</Td>
						<Td></Td>
					</Tr>
				</Tbody>
			</Table>
			{mutateError && <p>{mutateError.message}</p>}
		</Box>
	);
};
