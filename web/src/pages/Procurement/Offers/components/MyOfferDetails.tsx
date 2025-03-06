import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OfferFile } from '../../../Files/new/components/OfferFile';
import { PublishedOffer } from './PublishedOffer';

export const MyOffersDetails = (): JSX.Element => {
	// ! This is the page where the bidder can see his published offer
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	return (
		<Box p={4}>
			<PublishedOffer offerData={offerData} isOfferLoading={isLoading} />
			<Box marginTop={'2'}>
				<OfferFile />
			</Box>
		</Box>
	);
};
