import React from 'react';
import { useOfferDocuments } from '../../../../queries/useGetOfferDocuments';

export const OfferFolder = (): JSX.Element => {
	const offerId = 185;
	const { data } = useOfferDocuments(offerId);
	console.log(data, 'DATA');
	return (
		<div>
			<div>OfferFolder</div>
		</div>
	);
};
