import React from 'react';
import { useParams } from 'react-router-dom';
import { useOfferDocuments } from '../../../../queries/useGetOfferDocuments'; // use this endpoint and filter out what I need in the query, before return.

export const OfferFile = (): JSX.Element => {
	const { offerId } = useParams();
	const { data } = useOfferDocuments(Number(offerId));
	console.log(data, 'DATA');
	return <div>OfferFile</div>;
};
