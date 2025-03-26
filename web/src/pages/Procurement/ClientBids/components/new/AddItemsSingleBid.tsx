import { Box } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid } from '../../../../../models/Tender';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { BidIdHeader } from '../BidIdHeader';
import { BidIdTable } from '../BidIdTable';

interface AddItemsProps {
	bidId: number;
}

export function AddItemsSingleBid({ bidId }: AddItemsProps) {
	const { data, isLoading } = useGetBidById(Number(bidId));
	const bid: Bid | undefined = data?.bid;

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
