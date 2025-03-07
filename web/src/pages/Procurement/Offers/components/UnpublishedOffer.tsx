import { Box } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { OfferInformation } from './OfferInformation';
import { TenderTable } from './OfferTable';

export function UnpublishedOffer({ tenderId }) {
	// We need the tender information to show on the offer.
	const { data, isLoading } = useGetTenderById(tenderId);
	console.log('We here', { data });

	const tender = data?.tender;
	const tenderItems = tender?.items;

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<OfferInformation tender={tender} />
					<TenderTable tenderItems={tenderItems} />
				</>
			)}
		</Box>
	);
}
