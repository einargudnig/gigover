import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid } from '../../../../models/Tender';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { BidInfo } from './new/BidInfo';
import { BidItemList } from './new/BidItemList';

export const BidDetails = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();

	const { data, isLoading } = useGetBidById(Number(bidId)); // TODO add error handling
	const bid: Bid | undefined = data?.bid;

	const isBidPublished = bid?.status === 1;

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box>
					{isBidPublished ? <PublishedBid bid={bid} /> : <UnpublishedBid bid={bid!} />}
				</Box>
			)}
		</>
	);
};

function PublishedBid({ bid }: { bid: Bid }) {
	return (
		<Box>
			<BidInfo bid={bid!} />
			<BidItemList bid={bid!} />
		</Box>
	);
}

function UnpublishedBid({ bid }: { bid: Bid }) {
	return (
		<Box>
			<BidIdHeader bid={bid} />
			<BidIdTable bid={bid} />
		</Box>
	);
}
