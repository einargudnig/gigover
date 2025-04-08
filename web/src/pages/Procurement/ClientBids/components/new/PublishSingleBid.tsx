import { Box, Button, Flex, useToast } from '@chakra-ui/react';
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
	const { data, isLoading } = useGetBidById(bidId);
	const { mutateAsync: publishBid, isLoading: isPublishLoading } = usePublishBid();
	const toast = useToast();
	const bid: Bid | undefined = data?.bid;
	const bidItems: BidItem[] | undefined = bid?.items?.map((item) => ({
		...item,
		totalCost: item?.cost ? item?.cost * (item?.volume || 0) : 0
	}));

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

	const columns = [
		{ header: 'Number', accessor: 'nr', tooltip: 'Cost code', width: '16%' },
		{
			header: 'Description',
			accessor: 'description',
			tooltip: 'Description of a item',
			width: '16%'
		},
		{ header: 'Volume', accessor: 'volume', tooltip: 'Volume', width: '16%' },
		{
			header: 'Unit',
			accessor: 'unit',
			tooltip: 'Unit of measurement. For example: m2, kg, t',
			width: '16%'
		},
		{ header: 'Cost', accessor: 'cost', tooltip: 'Cost', width: '16%', isNumber: true },
		{
			header: 'Total Cost',
			accessor: 'totalCost',
			tooltip: 'Total cost (Cost × Volume)',
			width: '20%',
			isNumber: true
		}
	];

	return (
		<Box>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Info fields={bidFields} />
					<DataTable columns={columns} data={bidItems ?? []} />
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
