import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { OfferTable } from './OfferTable';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender, TenderItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { usePublishOffer } from '../../../../mutations/usePublishOffer';
// import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

export const TenderOffer = (): JSX.Element => {
	const { offerId } = useParams();
	const { tenderId } = useParams();
	const { data: tenderData, isLoading: isTenderLoading } = useGetTenderById(Number(tenderId));
	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();

	//! I could fetch the data from the useGetOfferById query.
	// and conditionally render the table before publishing offer and after
	// const { data: offerData, isLoading: isOfferLoading } = useGetOfferByOfferId(Number(offerId));
	// const offerItems: GetOfferItem[] | undefined = offerData?.offer.items;

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
			duration: 5000,
			isClosable: true
		});
	};

	// Conditionally render the table before publishing offer and after
	// use the status of the offer to determine if the offer has been published or not
	return (
		<>
			{isTenderLoading ? (
				<div>
					<LoadingSpinner />
				</div>
			) : (
				<>
					<OfferInformation tender={tender} />
					<OfferTable tenderItems={tenderItems} />

					<Button onClick={handlePublish} mt={'4'}>
						{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'}
					</Button>
				</>
			)}
		</>
	);

	// return (
	// 	<>
	// 		{isOfferLoading ? (
	// 			<div>
	// 				<LoadingSpinner />
	// 			</div>
	// 		) : (
	// 			<>
	// 				<OfferInformation tender={tender} />
	// 				<OfferTable tenderItems={tenderItems} />

	// 				<Button onClick={handlePublish} mt={'4'}>
	// 					{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'}
	// 				</Button>
	// 			</>
	// 		)}
	// 	</>
	// );
};
