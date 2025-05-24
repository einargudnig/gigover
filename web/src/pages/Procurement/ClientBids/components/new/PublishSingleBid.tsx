import { Box, Button, Center, Flex, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid, BidItem } from '../../../../../models/Tender';
import { usePublishBid } from '../../../../../mutations/procurement/client-bids/usePublishBid';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { Info } from '../../../components/Info';
import { DataTable } from '../../../components/Table';

export function PublishSingleBid({
	bidId,
	onPublishBid
}: {
	bidId: number;
	onPublishBid: () => void;
}) {
	const toast = useToast();

	const { data, isPending: getBidIsPending } = useGetBidById(bidId);
	const { mutateAsync: publishBid, isPending: publishBidIsPending } = usePublishBid();

	const bid: Bid | undefined = data?.bid;

	const bidItems: BidItem[] | undefined = bid?.items?.map((item) => ({
		...item,
		totalCost: item?.cost ? item?.cost * (item?.volume || 0) : 0
	}));

	const bidFields = [
		{ label: 'Description', value: bid?.description },
		{ label: 'Terms', value: bid?.terms },
		{ label: 'Status', value: bid?.status === 1 ? 'Published' : 'Draft' },
		{ label: 'Address', value: bid?.address },
		{ label: 'Delivery', value: bid?.delivery ? 'Yes' : 'No' },
		{ label: 'Valid Through', value: bid?.finishDate },
		{ label: 'Client Email', value: bid?.clientEmail },
		{ label: 'Notes', value: bid?.notes }
	];

	const columns = [
		{ header: 'Number', accessor: 'nr', tooltip: 'Cost code', width: '16%' },
		{
			header: 'Description',
			accessor: 'description',
			tooltip: 'Description of an item',
			width: '16%'
		},
		{
			header: 'Unit',
			accessor: 'unit',
			tooltip: 'Unit of measurement. For example: m2, kg, t',
			width: '20%'
		},
		{ header: 'Volume', accessor: 'volume', tooltip: 'Volume', width: '20%' },
		{
			header: 'Cost',
			accessor: 'cost',
			tooltip: 'Cost of single item',
			width: '16%',
			isNumber: true
		},
		{
			header: 'Total Cost',
			accessor: 'totalCost',
			tooltip: 'Total cost (Cost × Volume)',
			width: '20%',
			isNumber: true
		}
	];

	const handlePublishBid = async () => {
		if (!bid) {
			return;
		}
		try {
			await publishBid({ bidId: Number(bid.bidId) });
			toast({
				title: 'Bid Published',
				description: 'The bid has been successfully published.',
				status: 'success',
				duration: 5000,
				isClosable: true
			});
			onPublishBid();
		} catch (error) {
			toast({
				title: 'Error Publishing Bid',
				description: 'There was an error publishing the bid. Please try again.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	return (
		<Flex direction="column" align="center" justify="center" minH="80vh">
			<Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" maxW="xl" w="full">
				{getBidIsPending ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : bid ? (
					<VStack spacing={6} align="stretch">
						<Heading as="h2" size="lg" textAlign="center">
							Review and Publish Bid
						</Heading>
						<Info fields={bidFields} />
						<DataTable columns={columns} data={bidItems ?? []} showTotalCost={true} />
						<Text fontSize="sm" color="gray.500">
							Please review the bid details above. Once published, the bid will be
							visible and cannot be edited further unless unpublished.
						</Text>
						<Button
							mt={8}
							colorScheme="blue"
							onClick={handlePublishBid}
							isLoading={publishBidIsPending}
							w="full"
							isDisabled={!bid || bid?.status === 1}
						>
							{bid?.status === 1 ? 'Bid Already Published' : 'Publish Bid'}
						</Button>
					</VStack>
				) : (
					<Text textAlign="center">Bid not found or failed to load.</Text>
				)}
			</Box>
		</Flex>
	);
}
