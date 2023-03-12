import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './components/OfferInformation';
import { OfferTable } from './components/OfferTable';
import { useTenderById } from '../../../queries/useGetTenderById';
import { Tender, TenderItem } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

import { NewOfferTable } from './components/NewOfferTable';

interface Props {
	onUpdateRow: (updatedRow: TenderItem) => void;
}

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
	// const tenderItems: TenderItem[] | undefined = tender?.items; //! I get annoying error by trying to pass this into the offer table.
	// I'll look into it, but I really don't want to spend too much time on it.
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
					<OfferInformation
						description={tender?.description}
						terms={tender?.terms}
						address={tender?.address}
						delivery={tender?.delivery}
						finishDate={tender?.finishDate}
						phoneNumber={tender?.phoneNumber}
					/>
					{/* <OfferTable /> */}
					<NewOfferTable />
				</>
			)}
		</>
	);
};
