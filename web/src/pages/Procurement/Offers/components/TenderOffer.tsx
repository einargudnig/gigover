import React, { useRef } from 'react';
import {
	Button,
	ButtonProps,
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

export const TenderOffer = (): JSX.Element => {
	const { offerId } = useParams();
	const { tenderId } = useParams();
	const { data: tenderData, isLoading: isTenderLoading } = useGetTenderById(Number(tenderId));
	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();
	const { data: offerData, isLoading: isOfferLoading } = useGetOfferByOfferId(Number(offerId));
	const { isOpen, onOpen, onClose } = useDisclosure(); // This is for the confirm dialog

	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;
	// console.log('tender', tender);

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

	const isOfferPublished = offerData?.offer?.status === 1;
	// console.log('isOfferPublished', isOfferPublished);

	const UnPublished = () => {
		const handleOpenDialog: ButtonProps['onClick'] = (event) => {
			event.preventDefault();
			onOpen();
		};

		const cancelRef = useRef<HTMLButtonElement | null>(null);
		return (
			<>
				{isTenderLoading ? (
					<div>
						<LoadingSpinner />
					</div>
				) : (
					<>
						<OfferInformation tender={tender} />
						<TenderTable tenderItems={tenderItems} />

						<Button onClick={handleOpenDialog} mt={'4'}>
							{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'}
						</Button>

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
				showResultsButtons="false"
			/>
		)
	};

	const component = offerComponent[isOfferPublished ? 'published' : 'unpublished'];

	return component;
};
