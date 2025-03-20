import { Box, Heading, Text } from '@chakra-ui/react';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { Bid } from '../../../../../models/Tender';
import { BidIdHeader } from '../BidIdHeader';
import { BidIdTable } from '../BidIdTable';

interface AddItemsProps {
	bidId: number;
	onItemsAdded: () => void;
}

export function AddItemsSingleBid({ bidId, onItemsAdded }: AddItemsProps) {
	const { data, isLoading } = useGetBidById(Number(bidId)); // TODO add error handling
	const bid: Bid | undefined = data?.bid;

	return (
		<Box>
			<Heading size={'md'}>Add Items</Heading>
			{/* <BidIdHeader bid={bid} /> */}
			{/* <BidIdTable bid={bid} /> */}
		</Box>
	);
}
