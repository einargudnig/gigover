import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid } from '../../../../models/Tender';
import { usePublishBid } from '../../../../mutations/procurement/client-bids/usePublishBid';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { Info } from '../../components/Info';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
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
	const bidFields = [
		{ label: 'Description', value: bid.description },
		{ label: 'Terms', value: bid.terms },
		{ label: 'Status', value: bid.status === 1 ? 'Published' : 'Not Published' },
		{ label: 'Address', value: bid.address },
		{ label: 'Delivery', value: bid.delivery ? 'Yes' : 'No' },
		{ label: 'Valid Through', value: bid.finishDate },
		{ label: 'Client Email', value: bid.clientEmail },
		{ label: 'Notes', value: bid.notes }
	];

	return (
		<Box p={4}>
			{/* <BidInfo bid={bid!} /> */}
			<Info fields={bidFields} />
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
			{/* TODO: Upload file */}
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
