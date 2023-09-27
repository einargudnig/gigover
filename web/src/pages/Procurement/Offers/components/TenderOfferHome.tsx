import React, { useState, useEffect } from 'react';
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
	console.log('tender', tender);
	const { mutateAsync: bidderRejectAsync, isLoading: isBidderRejectLoading } = useBidderReject();
	// we will store the bidder status in the localStorage.
	const [hasAnswered, setHasAnswered] = useState(false);

	useEffect(() => {
		// check localStorage
		const bidderStatus = localStorage.getItem(`bidderStatus_${tenderId}`);
		if (bidderStatus === 'true') {
			setHasAnswered(true);
		}
	}, [tenderId]);

	const toast = useToast();

	const finishDateStatus = handleFinishDate(tender?.finishDate);
	// const finishDateStatus = false;
	console.log('finishDateStatus', finishDateStatus);

	const bidderRejectBody = {
		tenderId: Number(tenderId)
	};

	const handleReject = async () => {
		bidderRejectAsync(bidderRejectBody);
		setHasAnswered(true);
		localStorage.setItem(`bidderStatus_${tenderId}`, 'true');
		toast({
			title: 'Rejected!',
			description:
				'You have decided to not place an offer for this tender. The tender owner has been notified.',
			status: 'info',
			duration: 2000,
			isClosable: true
		});
	};

	// const handleAccept = async () => {
	// 	setHasAnswered(true);
	// 	localStorage.setItem(`bidderStatus_${tenderId}`, 'true');
	// };

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
								{hasAnswered ? (
									<Text>This offer has been answered</Text>
								) : (
									<Flex marginTop={'6'}>
										<OpenOffer />

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
