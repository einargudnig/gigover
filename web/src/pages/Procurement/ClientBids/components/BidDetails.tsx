import { Box, Flex, Text } from '@chakra-ui/react';
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
		<Box p={4}>
			<BidInfo bid={bid!} />
			<BidItemList bid={bid!} />
			<Flex justify={'end'} pr={2} pt={2}>
				<Text color={'gray.500'}>
					Bid has been published, waiting answer from: {bid.clientEmail}
				</Text>
			</Flex>
		</Box>
	);
}

function UnpublishedBid({ bid }: { bid: Bid }) {
	return (
		<Box p={4}>
			<BidIdHeader bid={bid} />
			<BidIdTable bid={bid} />
		</Box>
	);
}
