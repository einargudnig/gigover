import React from 'react';
// import { OfferId } from '../models/Tender';

interface OfferContext {
	offerId: number;
	setOfferId: (offerId: number) => void;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const OfferIdContext = React.createContext<OfferContext>({
	offerId: 0,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setOfferId: () => {}
});
