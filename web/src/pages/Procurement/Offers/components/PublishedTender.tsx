import React from 'react';
import { useParams } from 'react-router-dom';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const PublishedTender = (): JSX.Element => {
	// Here I should add the Accept/Reject buttons
	// That does make it so that it might be harder to reuse this component
	// I might be able to reuse it if I add a prop that determines if the buttons should be shown or not
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
