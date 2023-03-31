import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { OfferTable } from './OfferTable';
import { OfferIdContext } from '../../../../context/OfferIdContext';
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

export const TenderOffer = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;
	const { data: bidderTenders, isLoading } = useGetBidderTenders();
	const [offerId, setOfferId] = useState<number>(0); // This will help us update the offerId value for all the components that need it.

	if (isLoading) {
		return <LoadingSpinner />;
	}

	const tender = findTenderById(tenderId, bidderTenders);

	if (!tender) {
		alert('Tender with id {tenderId} not found');
	}

	return (
		<>
			<OfferIdContext.Provider value={{ offerId, setOfferId }}>
				<OfferInformation tender={tender} />
				<OfferTable tender={tender} />
			</OfferIdContext.Provider>
		</>
	);
};
