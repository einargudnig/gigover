import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './components/OfferInformation';
import { useTenderById } from '../../../queries/useGetTenderById';
import { Tender, OfferId } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { OfferTable } from './components/OfferTable';
import { OfferIdContext } from '../../../context/OfferIdContext';

export const TenderOffer = (): JSX.Element => {
	const { tenderId } = useParams(); //! CAST to number

	// GET tender by Id
	const {
		data,
		isLoading: isTenderLoading,
		isError: isTenderError,
		error: tenderError
	} = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	// const [offerId, setOfferId] = useState<number>(0); // This will help us update the offerId value for all the components that need it.
	const offerId = 33;
	return (
		<>
			{isTenderLoading ? (
				<LoadingSpinner />
			) : isTenderError ? (
				<div>
					{tenderError?.errorCode} something went wrong - {tenderError?.errorText}
				</div>
			) : (
				<>
					<OfferIdContext.Provider value={offerId}>
						<OfferInformation
							description={tender?.description}
							terms={tender?.terms}
							address={tender?.address}
							delivery={tender?.delivery}
							finishDate={tender?.finishDate}
							phoneNumber={tender?.phoneNumber}
						/>
						<OfferTable />
					</OfferIdContext.Provider>
				</>
			)}
		</>
	);
};
