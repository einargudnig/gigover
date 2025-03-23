import { Box } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid } from '../../../../../models/Tender';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { BidIdHeader } from '../BidIdHeader';
import { BidIdTable } from '../BidIdTable';

interface AddItemsProps {
	bidId: number;
	onItemsAdded: () => void;
}

export function AddItemsSingleBid({ bidId, onItemsAdded }: AddItemsProps) {
	const { data, isLoading } = useGetBidById(Number(bidId)); // TODO add error handling
	const bid: Bid | undefined = data?.bid;

	console.log('bid', bid);

	return (
		<Box>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<BidIdHeader bid={bid} />
					<BidIdTable bid={bid} />
				</>
			)}
		</Box>
	);
}
