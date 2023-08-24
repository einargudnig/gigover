import React from 'react';
import { useParams } from 'react-router-dom';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const PublishedTender = (): JSX.Element => {
	// ! This is the page for the tender owner to see the published offers
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	return (
		<PublishedOffer
			offerData={offerData}
			isOfferLoading={isLoading}
			showResultsButtons={true}
		/>
	);
};
