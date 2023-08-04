import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { Tender } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useToast } from '@chakra-ui/react';

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

	const toast = useToast();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	const tender = findTenderById(tenderId, bidderTenders);

	if (!tender) {
		toast({
			title: 'Tender not found',
			description: `Tender with id ${tenderId} not found`,
			status: 'error',
			duration: 5000,
			isClosable: true
		});
	}

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<OfferInformationHome tender={tender} />
					<OfferTableHome tender={tender} />
				</>
			)}
		</>
	);
};
