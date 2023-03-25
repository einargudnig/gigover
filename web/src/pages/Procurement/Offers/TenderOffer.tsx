import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './components/OfferInformation';
import { OfferTable } from './components/OfferTable';
import { OfferIdContext } from '../../../context/OfferIdContext';
// import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { Tender } from '../../../models/Tender';

// type TenderIdParams = {
// 	tenderId: string;
// };

// function findTenderById(tenderId: string, bidderTenders: Tender[]): Tender {
// 	const tender = bidderTenders.find((t) => t.tenderId === Number(tenderId));
// 	if (!tender) {
// 		throw new Error(`Tender with id ${tenderId} not found`);
// 	}
// 	return tender;
// }

export const TenderOffer = (): JSX.Element => {
	// const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;
	const [offerId, setOfferId] = useState<number>(0); // This will help us update the offerId value for all the components that need it.

	// I should get the bidder tender here and pass the down
	//! I can't, since I will have to hav access to the tenderId -> I can get it from the URL here instead of in the component

	return (
		<>
			<OfferIdContext.Provider value={{ offerId, setOfferId }}>
				<OfferInformation />
				<OfferTable />
			</OfferIdContext.Provider>
		</>
	);
};
