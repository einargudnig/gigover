import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { OfferInformation } from './OfferInformation';
import { OfferTable } from './OfferTable';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { Tender, TenderItem } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { usePublishOffer } from '../../../../mutations/usePublishOffer';

export const TenderOffer = (): JSX.Element => {
	const { offerId } = useParams();
	const { tenderId } = useParams();
	const { data: tenderData, isLoading: isTenderLoading } = useGetTenderById(Number(tenderId));
	const { mutateAsync: publishOffer, isLoading: isPublishLoading } = usePublishOffer();

	const tender: Tender | undefined = tenderData?.tender;
	const tenderItems: TenderItem[] | undefined = tender?.items;

	const toast = useToast();

	const handlePublish = () => {
		publishOffer(Number(offerId));
		toast({
			title: 'Offer published',
			description: 'Your offer has been published!',
			status: 'success',
			duration: 5000,
			isClosable: true
		});
	};

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

					<Button onClick={handlePublish}>
						{isPublishLoading ? <LoadingSpinner /> : 'Publish Offer'}
					</Button>
				</>
			)}
		</>
	);
};
