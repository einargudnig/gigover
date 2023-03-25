import React, { useState } from 'react';
import { OfferInformation } from './components/OfferInformation';
import { OfferTable } from './components/OfferTable';
import { OfferIdContext } from '../../../context/OfferIdContext';

export const TenderOffer = (): JSX.Element => {
	const [offerId, setOfferId] = useState<number>(0); // This will help us update the offerId value for all the components that need it.
	// const offerId = 33;
	return (
		<>
			<OfferIdContext.Provider value={{ offerId, setOfferId }}>
				<OfferInformation />
				<OfferTable />
			</OfferIdContext.Provider>
		</>
	);
};
