import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid } from '../../../../models/Tender';
import { usePublishBid } from '../../../../mutations/procurement/client-bids/usePublishBid';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { BidInfo } from './new/BidInfo';
import { BidItemList } from './new/BidItemList';

export const BidDetails = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();
	const navigate = useNavigate();
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
			<HandleBid bid={bid} />
		</Box>
	);
}

function HandleBid({ bid }: { bid: Bid }) {
	const { mutateAsync: publishBid, isLoading: isPublishLoading } = usePublishBid();
	const toast = useToast();

	const finishDateStatus = handleFinishDate(bid?.finishDate);

	const handlePublish = async () => {
		const publishBidBody = {
			bidId: Number(bid.bidId)
		};
		if (bid !== undefined) {
			try {
				await publishBid(publishBidBody);
				toast({
					title: 'Bid published',
					description: 'Now you can invite people to send offers to your bid!',
					status: 'success',
					duration: 2000,
					isClosable: true
				});
			} catch (error) {
				// console.log('ERROR', { error });
				toast({
					title: 'Error',
					description: 'Something went wrong when we tried to publish your bid.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		} else {
			toast({
				title: 'Error',
				description: 'Something went wrong when we tried to publish your bid.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	return (
		<Flex justify={'end'} pr={2} pt={2}>
			<Button
				colorScheme={'black'}
				variant={'outline'}
				onClick={handlePublish}
				isLoading={isPublishLoading}
				isDisabled={finishDateStatus}
			>
				Publish Bid
			</Button>
		</Flex>
	);
}
