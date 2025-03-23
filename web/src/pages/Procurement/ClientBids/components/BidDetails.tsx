import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid } from '../../../../models/Tender';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';

export const BidDetails = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();

	const { data, isLoading } = useGetBidById(Number(bidId)); // TODO add error handling
	const bid: Bid | undefined = data?.bid;

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<div style={{ width: '100%' }}>
					<Flex direction={'column'}>
						<BidIdHeader bid={bid} />
						<BidIdTable bid={bid} />
					</Flex>
				</div>
			)}
		</>
	);
};
