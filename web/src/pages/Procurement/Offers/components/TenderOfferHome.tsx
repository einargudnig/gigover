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
	console.log('tender', tender);
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
		const bidder = bidders.find((b: Bidder) => b?.email === userEmail);
		console.log('bidder', bidder);

		return bidder?.status;
	};

	const bidderStatus = checkIfUserIsBidder(biddersFromTender);
	console.log('bidderStatus', bidderStatus);

	const showCorrectBidderStatusText = (status?: string | number) => {
		if (status === 1) {
			return (
				<Text fontSize={'xl'} color={'green'}>
					This offer has been <strong>accepted!</strong>
				</Text>
			);
		} else if (status === 0) {
			return (
				<Text fontSize={'xl'} color={'red'}>
					This offer has been <strong>rejected!</strong>
				</Text>
			);
		}
		return <Text>This offer has not been answered yet.</Text>;
	};

	const finishDateStatus = handleFinishDate(tender?.finishDate);

	const bidderRejectBody = {
		tenderId: Number(tenderId)
	};

	const handleReject = async () => {
		bidderRejectAsync(bidderRejectBody);
		setShowText(true);
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
									<>{showCorrectBidderStatusText(bidderStatus)}</>
								) : (
									<Flex marginTop={'6'}>
										<Box onClick={() => setShowText(true)}>
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
