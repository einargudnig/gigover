import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OfferInformationHome } from './OfferInformationHome';
import { OfferTableHome } from './OfferTableHome';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Box, Flex, Spacer, Button, Text, useToast, Heading, VStack } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { useBidderReject } from '../../../../mutations/useBidderReject';
// import { UserContext } from '../../../../context/UserContext';

import { OpenOffer } from './OpenOffer';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';

type TenderIdParams = {
	tenderId: string;
};

export const TenderOfferHome = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;

	const { data, isLoading } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	const tenderDocuments = tender?.documents;
	const { mutateAsync: bidderRejectAsync, isLoading: isBidderRejectLoading } = useBidderReject();
	// we will store the bidder status in the localStorage.
	const [hasAnswered, setHasAnswered] = useState(false);
	// const user = useContext(UserContext); //! Maybe I need this one to figure out what the bidder answered

	useEffect(() => {
		// check localStorage
		const bidderStatus = localStorage.getItem(`bidderStatus_${tenderId}`);
		if (bidderStatus === 'true') {
			setHasAnswered(true);
		}
	}, [tenderId]);

	const toast = useToast();
	const navigate = useNavigate();

	const finishDateStatus = handleFinishDate(tender?.finishDate);
	// const finishDateStatus = false;

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
		navigate('/bidder-tenders', { replace: true });
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
								{hasAnswered ? (
									<Flex direction={'row'}>
										<Text as={'b'} mr={'1'}>
											You
										</Text>
										<Text as={'b'} color={'red'}>
											declined
										</Text>
										<Text as={'b'} ml={'1'}>
											to open an offer for this tender
										</Text>
									</Flex>
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

						<div>
							{tenderDocuments!.length > 0 ? (
								<VStack
									style={{ width: '100%' }}
									align={'stretch'}
									spacing={4}
									mt={4}
								>
									<Heading size={'md'}>Tender owner added these files</Heading>
									{tenderDocuments!
										.sort((a, b) =>
											b.created && a.created ? b.created - a.created : -1
										)
										.map((p, pIndex) => (
											<OtherGigoverFile
												key={pIndex}
												showDelete={false}
												file={p}
											/>
										))}
								</VStack>
							) : (
								<EmptyState
									title={'No files uploaded'}
									text={
										'The Tender owner has not added any files to this tender.'
									}
								/>
							)}
						</div>
					</>
				</>
			)}
		</>
	);
};
