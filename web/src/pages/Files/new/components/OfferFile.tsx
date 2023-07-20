import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const OfferFile = (): JSX.Element => {
	const { offerId } = useParams();
	const { data } = useGetOfferByOfferId(Number(offerId));
	// console.log(data, 'DATA');
	// const offerDocuments = data?.offer.documents;
	return <div>OfferFile</div>;
};
