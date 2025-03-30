import { Box } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Bid } from '../../../../../models/Tender';
import { useGetBidById } from '../../../../../queries/procurement/client-bids/useGetBidById';
import { Info } from '../../../components/Info';
import { BidIdTable } from '../BidIdTable';
interface AddItemsProps {
	bidId: number;
}

export function AddItemsSingleBid({ bidId }: AddItemsProps) {
	const { data, isLoading } = useGetBidById(Number(bidId));
	const bid: Bid | undefined = data?.bid;

	const bidFields = [
		{ label: 'Description', value: bid?.description },
		{ label: 'Terms', value: bid?.terms },
		{ label: 'Address', value: bid?.address },
		{ label: 'Delivery', value: bid?.delivery ? 'Yes' : 'No' },
		{ label: 'Close date', value: bid?.finishDate },
		{
			label: 'Status',
			value: bid?.status === 1 ? 'Published' : 'Not Published'
		},
		{ label: 'Notes', value: bid?.notes },
		{ label: 'Client email', value: bid?.clientEmail }
	];

	return (
		<Box>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<Info fields={bidFields} />
					<BidIdTable bid={bid} />
				</>
			)}
		</Box>
	);
}
