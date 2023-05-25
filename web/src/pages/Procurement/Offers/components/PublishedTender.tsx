import React from 'react';
import { useParams } from 'react-router-dom';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const PublishedTender = (): JSX.Element => {
	const { offerId } = useParams();
	const { data, isLoading } = useGetOfferByOfferId(Number(offerId));
	const offer = data?.offer;

	return <PublishedOffer offerData={offer} isOfferLoading={isLoading} />;
};
