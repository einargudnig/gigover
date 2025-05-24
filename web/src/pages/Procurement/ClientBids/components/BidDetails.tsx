import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../../../components/loading/LoadingSpinner';
import { Bid } from '../../../../models/procurement/Bid';
import { usePublishBid } from '../../../../mutations/procurement/client-bids/usePublishBid';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { handleFinishDate } from '../../../../utils/functions';
import { PublishedBid } from './PublishedBid';
import { UnpublishedBid } from './UnpublishedBid';

// TODO: remove this when a proper solution is in place
const BidDetails = ({ bidId, tenderId }: BidDetailsProps) => {
	const { data, isPending } = useGetBidById(Number(bidId)); // TODO add error handling
	// const tender = useGetTenderById(Number(tenderId));
	// const { colorMode } = useColorMode();
	// const textColor = useColorModeValue('gray.700', 'white');

	const navigate = useNavigate(); // Moved navigate up
	if (isPending) {
		return <LoadingSpinner />;
	}

	const bid: Bid | undefined = data?.bid;
	const isBidPublished = bid?.status === 1;

	return (
		<>
			<Box p={4}>
				<Button
					onClick={() => navigate(-1)}
					variant={'link'}
					colorScheme={'gray'}
					fontSize={'lg'}
				>
					<ArrowBackIcon />
				</Button>
				{isBidPublished ? <PublishedBid bid={bid} /> : <UnpublishedBid bid={bid!} />}
			</Box>
		</>
	);
};

// TODO: remove this when a proper solution is in place
interface BidDetailsProps {
	bidId: string;
	tenderId: string;
}

function HandleBid({ bid }: { bid: Bid }) {
	const { mutateAsync: publishBid, isPending: isPublishPending } = usePublishBid();
	const toast = useToast();

	const finishDateStatus = handleFinishDate(bid?.finishDate);

	const handlePublishBid = async () => {
		const publishBidBody = {
			bidId: Number(bid.bidId)
		};
		try {
			await publishBid(publishBidBody);
			toast({
				title: 'Success',
				description: 'Bid published successfully',
				status: 'success',
				duration: 5000,
				isClosable: true
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Error publishing bid',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};
	return (
		<Box mt={4}>
			<Button
				colorScheme={'black'}
				variant={'outline'}
				onClick={handlePublishBid}
				isLoading={isPublishPending}
				isDisabled={finishDateStatus}
			>
				Publish Bid
			</Button>
		</Box>
	);
}

export default BidDetails;
