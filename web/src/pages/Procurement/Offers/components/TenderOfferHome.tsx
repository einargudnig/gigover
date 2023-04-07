import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
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

export const TenderOfferHome = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;
	const { data: bidderTenders, isLoading } = useGetBidderTenders();
	// console.log('bidderTenders', bidderTenders);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	const tender = findTenderById(tenderId, bidderTenders);

	//! Add back when I've made the general popup!
	// if (!tender) {
	// 	alert('Tender with id {tenderId} not found');
	// }

	return (
		<>
			<OfferInformationHome tender={tender} />
			<OfferTableHome tender={tender} />
		</>
	);
};
