import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { useTenderById } from '../../../../queries/useGetTenderById';
import { Tender, TenderItem } from '../../../../models/Tender';
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

	const { data } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	if (isLoading) {
		return <LoadingSpinner />;
	}

	// const tender = findTenderById(tenderId, bidderTenders);

	if (!tender) {
		alert('Tender with id {tenderId} not found');
	}

	return (
		<>
			<OfferInformationHome tender={tender} />
			{/* <OfferTableHome tender={tender} /> */}
		</>
	);
};
