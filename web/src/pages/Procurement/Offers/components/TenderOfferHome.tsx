import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
// import { useGetBidderTenders } from '../../../../queries/useGetBidderTenders';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender, Bidder } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Box, Flex, Spacer, Button, Text, useToast } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { useBidderReject } from '../../../../mutations/useBidderReject';
import { UserContext } from '../../../../context/UserContext';

import { OpenOffer } from './OpenOffer';

type TenderIdParams = {
	tenderId: string;
};

export const TenderOfferHome = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;

	const { data, isLoading } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;

	const { mutateAsync: bidderRejectAsync, isLoading: isBidderRejectLoading } = useBidderReject();
	const [showText, setShowText] = useState(false);

	const toast = useToast();
	const user = useContext(UserContext);
	const userEmail = user?.userName;
	const biddersFromTender = tender?.bidders;
	console.log('HERE BIDERS', userEmail, biddersFromTender);

	// function that checks if the userEmail is in the bidders array
	const checkIfUserIsBidder = (bidders?: Bidder[]): string | number | undefined => {
		if (!bidders) {
			return undefined;
		}
		const bidder = bidders.find((b: Bidder) => b?.email === userEmail); //! Maybe I will need to update this to userName??
		console.log('bidder', bidder);
		return bidder?.status;
	};

	const bidderStatus = checkIfUserIsBidder(biddersFromTender);
	console.log('bidderStatus', bidderStatus);

	const finishDateStatus = handleFinishDate(tender?.finishDate);

	const bidderRejectBody = {
		tenderId: Number(tenderId)
	};

	const handleReject = async () => {
		bidderRejectAsync(bidderRejectBody);
		// setShowText(true);
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
					<>
						{!finishDateStatus ? (
							<>
								{showText ? (
									<Text marginTop={'6'} color={'black'}>
										You have already answered this offer.
									</Text>
								) : (
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
								)}
							</>
						) : (
							<Text marginTop={'6'}>
								The tender has closed. You can&apos;t answer this offer.
							</Text>
						)}
					</>
				</>
			)}
		</>
	);
};
