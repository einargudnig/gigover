import React from 'react';
import { useParams } from 'react-router-dom';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const PublishedTender = (): JSX.Element => {
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	return <PublishedOffer offerData={offerData} isOfferLoading={isLoading} />;
};
