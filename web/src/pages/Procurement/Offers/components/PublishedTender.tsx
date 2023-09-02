import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { Button, Box, Text } from '@chakra-ui/react';

// Testing if this works
import { TenderFile } from '../../../Files/new/components/TenderFile';

export const PublishedTender = (): JSX.Element => {
	// ! This is the page for the tender owner to see the published offers
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	return (
		<>
			<PublishedOffer
				offerData={offerData}
				isOfferLoading={isLoading}
				showResultsButtons={true}
			/>
			<Box marginTop={'2'}>
				<TenderFile />
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
