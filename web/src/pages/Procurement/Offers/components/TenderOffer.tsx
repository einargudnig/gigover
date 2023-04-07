import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { OfferTable } from './OfferTable';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { GetOffer, GetOfferItem } from '../../../../models/Tender';
// import { LoadingSpinner } from '../../../../components/LoadingSpinner';

export const TenderOffer = (): JSX.Element => {
	const { offerId } = useParams();
	const { data: offersById } = useGetOfferByOfferId(Number(offerId));
	console.log('offersById', offersById);

	const offer: GetOffer | undefined = offersById?.offer;
	const offerItems: GetOfferItem[] | undefined = offer?.items;
	console.log('offer', offer);
	console.log('offerItems', offerItems);

	// if (isLoading) {
	// 	return <LoadingSpinner />;
	// }

	// const tender = findTenderById(tenderId, bidderTenders);

	// if (!tender) {
	// 	alert('Tender with id {tenderId} not found');
	// }

	return (
		<>
			<OfferInformation offer={offer} />
			<OfferTable offerItems={offerItems} />
		</>
	);
};
