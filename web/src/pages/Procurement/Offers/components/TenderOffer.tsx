import React, { useRef, useState } from 'react';
import {
	Button,
	ButtonProps,
	Box,
	Flex,
	useToast,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogBody,
	useDisclosure,
	HStack,
	Spacer,
	Tooltip,
	Text
} from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { TenderTable } from './OfferTable';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender, TenderItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { usePublishOffer } from '../../../../mutations/usePublishOffer';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { UploadCertifications } from './UploadCertifications';
import { OfferFile } from '../../../Files/new/components/OfferFile';

export const TenderOffer = (): JSX.Element => {
	const { offerId } = useParams();
	const { tenderId } = useParams();
	const [upload, setUpload] = useState(false);
	const { data: tenderData, isLoading: isTenderLoading } = useGetTenderById(Number(tenderId));
	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();
	const { isOpen, onOpen, onClose } = useDisclosure(); // This is for the confirm dialog
	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const toast = useToast();
	const navigate = useNavigate();

	const handlePublish = () => {
		const offerIdBody = {
			offerId: Number(offerId)
		};

		publishOffer(offerIdBody);
		toast({
			title: 'Offer published',
			description: 'Your offer has been published!',
			status: 'success',
			duration: 4000,
			isClosable: true
		});
		// navigate to the new page -> this should be the bidder view of the published offer, *not* with the handling buttons
		navigate(`/published-offer/${tenderId}/${offerId}`);
	};

	const handleOpenDialog: ButtonProps['onClick'] = (event) => {
		event.preventDefault();
		onOpen();
	};

	const cancelRef = useRef<HTMLButtonElement | null>(null);
	const finishDateStatus = handleFinishDate(tender?.finishDate);
	// const finishDateStatus = false;

	return (
		<>
			{upload && (
				<UploadCertifications
					onClose={() => {
						setUpload(false);
					}}
					onComplete={(status) => {
						console.log('status', status);
					}}
					offerId={Number(offerId)}
				/>
			)}
			{isTenderLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Flex flexDirection={'column'}>
						<Box>
							<OfferInformation tender={tender} />
							<TenderTable tenderItems={tenderItems} />
						</Box>
						<Flex align={'center'}>
							<Box>
								{!finishDateStatus ? (
									<Button onClick={handleOpenDialog} mt={'4'}>
										{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'}
									</Button>
								) : (
									<Text>
										The tender has expired, you cannot publish the offer
									</Text>
								)}
							</Box>
							<Spacer />
							<Box>
								<HStack>
									<Tooltip label="We recommend you save your changes before uploading files.">
										<Button onClick={() => setUpload(true)}>
											Upload files
										</Button>
									</Tooltip>
									<Spacer />
									<Button>
										<Link to={`/files/tender/offers/${offerId}`}>
											View files
										</Link>
									</Button>
								</HStack>
							</Box>
						</Flex>
					</Flex>

					<OfferFile />

					<AlertDialog
						isOpen={isOpen}
						onClose={onClose}
						leastDestructiveRef={cancelRef}
						portalProps={{ appendToParentPortal: true }}
					>
						<AlertDialogOverlay>
							<AlertDialogContent>
								<AlertDialogHeader>Publish offer</AlertDialogHeader>
								<AlertDialogBody>
									<Text>Are you sure you want to publish this offer?</Text>
									<Text>You cannot update the offer after publishing.</Text>
								</AlertDialogBody>
								<AlertDialogFooter>
									<Button
										ref={cancelRef}
										onClick={onClose}
										variant={'outline'}
										colorScheme={'gray'}
									>
										Cancel
									</Button>
									<Button
										onClick={() => {
											handlePublish();
											onClose();
										}}
										ml={3}
									>
										Publish
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
				</>
			)}
		</>
	);
};
