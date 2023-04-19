import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { OfferTable } from './OfferTable';
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
	// console.log('offerData', offerData);

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
			duration: 5000,
			isClosable: true
		});
	};

	const isOfferPublished = offerData?.offer?.status === 1;

	const UnPublished = () => {
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
	};

	const offerComponent = {
		unpublished: <UnPublished />,
		published: (
			<PublishedOffer
				offerId={offerId}
				offerData={offerData}
				isOfferLoading={isOfferLoading}
			/>
		)
	};

	const component = offerComponent[isOfferPublished ? 'published' : 'unpublished'];

	return component;
};
