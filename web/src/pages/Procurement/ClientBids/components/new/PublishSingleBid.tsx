import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid } from '../../../../../models/Tender';
import { usePublishBid } from '../../../../../mutations/procurement/client-bids/usePublishBid';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { BidInfo } from './BidInfo';
import { BidItemList } from './BidItemList';

export function PublishSingleBid({
	bidId,
	onPublishBid
}: {
	bidId: number;
	onPublishBid: () => void;
}) {
	const { data, isLoading } = useGetBidById(bidId);
	const { mutateAsync: publishBid, isLoading: isPublishLoading } = usePublishBid();
	const toast = useToast();
	const bid: Bid | undefined = data?.bid;

	const handlePublish = async () => {
		const publishBidBody = {
			bidId
		};

		await publishBid(publishBidBody);
		toast({
			title: 'Bid published',
			description: 'Bid has been published!',
			status: 'success',
			duration: 2000
		});
		onPublishBid();
	};

	return (
		<Box>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<BidInfo bid={bid!} />
					<BidItemList bid={bid!} />
					<Flex marginTop={5} justifyContent={'end'}>
						<Button
							variant={'outline'}
							colorScheme={'black'}
							onClick={handlePublish}
							isLoading={isPublishLoading}
						>
							Publish
						</Button>
					</Flex>
				</>
			)}
		</Box>
	);
}
