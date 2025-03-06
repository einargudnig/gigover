import { Box } from '@chakra-ui/react';
import { TenderTable } from './OfferTable';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { OfferInformation } from './OfferInformation';

export function UnpublishedOffer({ tenderId, offerData }) {
	// We need the tender information to show on the offer.
	const { data, isLoading } = useGetTenderById(tenderId);

	const tender = data?.tender;
	const tenderItems = tender?.items;

	return (
		<Box p={4}>
			<OfferInformation tender={tender} />
			<TenderTable tenderItems={tenderItems} />
		</Box>
	);
}
