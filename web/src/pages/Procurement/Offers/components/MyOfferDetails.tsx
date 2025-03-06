import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OfferFile } from '../../../Files/new/components/OfferFile';
import { PublishedOffer } from './PublishedOffer';
import { UnpublishedOffer } from './UnpublishedOffer';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Center } from '../../../../components/Center';

export const MyOffersDetails = (): JSX.Element => {
	const { tenderId, offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	const offerDocuments = offerData?.offer?.documents;

	const isUnpublished = offerData?.offer?.status === 0;
	console.log('isUnpublished', isUnpublished);

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{isUnpublished ? (
						<UnpublishedOffer tenderId={Number(tenderId)} offerData={offerData} />
					) : (
						<PublishedOffer offerData={offerData} isOfferLoading={isLoading} />
					)}
					<Box marginTop={'2'}>
						<OfferFile offerDocuments={offerDocuments} />
					</Box>
				</>
			)}
		</Box>
	);
};
