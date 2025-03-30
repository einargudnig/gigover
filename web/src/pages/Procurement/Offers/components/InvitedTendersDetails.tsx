import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Spacer, Text, VStack, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { TenderWithItems } from '../../../../models/Tender';
import { useBidderReject } from '../../../../mutations/procurement/useBidderReject';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { Info } from '../../components/Info';
import { TenderTable } from './OfferTable';
import { OpenOffer } from './OpenOffer';
type TenderIdParams = {
	tenderId: string;
};

export const InvitedTendersDetails = (): JSX.Element => {
	const { tenderId } = useParams<keyof TenderIdParams>() as TenderIdParams;

	const { data, isLoading } = useGetTenderById(Number(tenderId));
	const tender: TenderWithItems | undefined = data?.tender;
	const tenderItems = tender?.items;
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

	const tenderFields = [
		{ label: 'Description', value: tender?.description },
		{ label: 'Terms', value: tender?.terms },
		{ label: 'Address', value: tender?.address },
		{ label: 'Delivery', value: tender?.delivery ? 'Yes' : 'No' },
		{ label: 'Close date', value: tender?.finishDate }
	];

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<Box p={4}>
					<Button
						onClick={() => navigate(-1)}
						variant={'link'}
						colorScheme={'gray'}
						fontSize={'lg'}
					>
						<ArrowBackIcon />
					</Button>
					<Info fields={tenderFields} />
					<TenderTable tenderItems={tenderItems} />
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
										<Button
											onClick={handleReject}
											variant={'outline'}
											colorScheme={'gray'}
										>
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
							<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
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
								text={'The Tender owner has not added any files to this tender.'}
							/>
						)}
					</div>
				</Box>
			)}
		</Box>
	);
};
