import { Box } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid } from '../../../../../models/Tender';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { BidInfo } from './BidInfo';
import { BidItemList } from './BidItemList';

export function PublishSingleBid({ bidId }: { bidId: number }) {
	const { data, isLoading } = useGetBidById(bidId);

	const bid: Bid | undefined = data?.bid;

	return (
		<Box>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<BidInfo bid={bid!} />
					<BidItemList bid={bid!} />
				</>
			)}
		</Box>
	);
}
