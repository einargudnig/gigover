import { Box, Button, Text } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OfferFile } from '../../../Files/new/components/OfferFile';
import { PublishedOffer } from './PublishedOffer';

export const OfferPublished = (): JSX.Element => {
	// ! This is the page where the bidder can see his published offer
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	return (
		<>
			<PublishedOffer
				offerData={offerData}
				isOfferLoading={isLoading}
				showResultsButtons={false}
			/>
			<Box marginTop={'2'}>
				<OfferFile />
			</Box>
			<Box marginTop={'3'}>
				<Link to={`/files/tender/offers/${offerId}`}>
					<Button ml={'1'}>
						<Text textColor={'black'}>View files</Text>
					</Button>
				</Link>
			</Box>
		</>
	);
};
