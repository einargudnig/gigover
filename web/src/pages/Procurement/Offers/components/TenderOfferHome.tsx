import React from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
// import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Box, Flex, Spacer, Button, Text, useToast } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { useBidderReject } from '../../../../mutations/useBidderReject';

import { OpenOffer } from './OpenOffer';

type TenderIdParams = {
	tenderId: string;
};

export const TenderOfferHome = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;

	const { data, isLoading } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const { mutateAsync: bidderRejectAsync, isLoading: isBidderRejectLoading } = useBidderReject();

	const toast = useToast();

	const finishDateStatus = handleFinishDate(tender?.finishDate);

	// if (!tender) {
	// 	toast({
	// 		title: 'Tender not found',
	// 		description: `Tender with id ${tenderId} not found`,
	// 		status: 'error',
	// 		duration: 5000,
	// 		isClosable: true
	// 	});
	// }

	const bidderRejectBody = {
		tenderId: Number(tenderId)
	};

	const handleReject = async () => {
		bidderRejectAsync(bidderRejectBody);
		toast({
			title: 'Rejected!',
			description:
				'You have decided to not place an offer for this tender. The tender owner has been notified.',
			status: 'info',
			duration: 2000,
			isClosable: true
		});
	};

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
								<Button onClick={handleReject}>
									{isBidderRejectLoading ? (
										<LoadingSpinner />
									) : (
										'Will not place an offer'
									)}
								</Button>
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
