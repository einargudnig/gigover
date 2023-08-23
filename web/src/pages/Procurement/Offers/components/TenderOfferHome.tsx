import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { Tender } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useToast, Box, Flex, Spacer, Button, Text } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';

import { OpenOffer } from './OpenOffer';

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
	console.log('bidderTenders', bidderTenders);

	const toast = useToast();

	const tender = findTenderById(tenderId, bidderTenders);

	const finishDateStatus = handleFinishDate(tender.finishDate);

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
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<OfferInformationHome tender={tender} />
					<OfferTableHome tender={tender} />
					{!finishDateStatus ? (
						<Flex marginTop={'6'}>
							<Box>
								<OpenOffer />
							</Box>
							<Spacer />
							<Box>
								<Button>Will not place an offer</Button>
							</Box>
						</Flex>
					) : (
						<Text marginTop={'6'}>
							The tender has closed. You can&apos;t open an offer.
						</Text>
					)}
				</>
			)}
		</>
	);
};
