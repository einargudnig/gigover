import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid } from '../../../../../models/Tender';
import { usePublishBid } from '../../../../../mutations/procurement/client-bids/usePublishBid';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { Info } from '../../../components/Info';
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

	const bidFields = [
		{ label: 'Description', value: bid?.description },
		{ label: 'Terms', value: bid?.terms },
		{ label: 'Status', value: bid?.status === 1 ? 'Published' : 'Not Published' },
		{ label: 'Address', value: bid?.address },
		{ label: 'Delivery', value: bid?.delivery ? 'Yes' : 'No' },
		{ label: 'Valid Through', value: bid?.finishDate },
		{ label: 'Client Email', value: bid?.clientEmail },
		{ label: 'Notes', value: bid?.notes }
	];

	return (
		<Box>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Info fields={bidFields} />
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
					{/* TODO: Upload file */}
				</>
			)}
		</Box>
	);
}
