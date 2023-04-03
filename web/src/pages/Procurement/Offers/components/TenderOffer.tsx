import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { OfferTable } from './OfferTable';
import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { useTenderById } from '../../../../queries/useGetTenderById';
import { Tender } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

type TenderIdParams = {
	tenderId: string;
};

function findTenderById(tenderId: string, bidderTenders: Tender[]): Tender {
	const tender = bidderTenders.find((t) => t.tenderId === Number(tenderId));
	if (!tender) {
		throw new Error(`Tender with id ${tenderId} not found`);
	}
	return tender;
}

export const TenderOffer = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;
	const { offerId } = useParams();

	const { data: bidderTenders, isLoading } = useGetBidderTenders();
	const { data: offersById } = useGetOfferByOfferId(Number(offerId));
	const { data } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const bigRealObject = {
		tenderId: Number(tenderId),
		items: tenderItems,
		cost: offerItems?.cost,
		notes: offerItems?.notes
	};
	console.log('bigRealObject', bigRealObject);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	const tender = findTenderById(tenderId, bidderTenders);

	if (!tender) {
		alert('Tender with id {tenderId} not found');
	}

	return (
		<>
			<OfferInformation tender={tender} />
			<OfferTable tender={tender} />
		</>
	);
};
