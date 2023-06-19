import React, { useRef } from 'react';
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
	Text
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { TenderTable } from './OfferTable';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender, TenderItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { usePublishOffer } from '../../../../mutations/usePublishOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { PublishedOffer } from './PublishedOffer';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';

export const TenderOffer = (): JSX.Element => {
	const { offerId } = useParams();
	const { tenderId } = useParams();
	const { data: tenderData, isLoading: isTenderLoading } = useGetTenderById(Number(tenderId));
	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();
	const { data: offerData, isLoading: isOfferLoading } = useGetOfferByOfferId(Number(offerId));
	const { isOpen, onOpen, onClose } = useDisclosure(); // This is for the confirm dialog

	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const toast = useToast();

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
	};

	// we need to map offerStatus to true/false, so we can render the correct component
	// 0: 'Unpublished' -> false
	// 1: 'Published' -> true
	// 2: 'Accepted' -> true
	// 3: 'Rejected' -> true

	const offerStatus = {
		0: false,
		1: true,
		2: true,
		3: true
	};
	const isOfferPublished = offerStatus[offerData?.offer?.status || 0];

	const UnPublished = () => {
		const handleOpenDialog: ButtonProps['onClick'] = (event) => {
			event.preventDefault();
			onOpen();
		};

		const cancelRef = useRef<HTMLButtonElement | null>(null);
		const finishDateStatus = handleFinishDate(tender?.finishDate); // Can't do this check sooner? I still need to check if the order is published or not

		return (
			<>
				{isTenderLoading ? (
					<div>
						<LoadingSpinner />
					</div>
				) : (
					<>
						<Flex flexDirection={'column'}>
							<Box>
								<OfferInformation tender={tender} />
								<TenderTable tenderItems={tenderItems} />
							</Box>
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
						</Flex>

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

	// The definition has changed a bit, but this will still be the same.
	// The bidder cannot re-publish. So after he publishes the offer, he will see the published offer.
	// but he will not be able to edit it.
	const offerComponent = {
		unpublished: <UnPublished />,
		published: (
			<PublishedOffer
				offerData={offerData}
				isOfferLoading={isOfferLoading}
				showResultsButtons={false}
			/>
		)
	};

	const component = offerComponent[isOfferPublished ? 'published' : 'unpublished'];

	return component;
};
