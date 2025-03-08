import { Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { FileUploadType } from '../../../../models/FileUploadType';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OfferFile } from '../../../Files/new/components/OfferFile';
import { PublishOfferButton } from './PublishOfferButton';
import { PublishedOffer } from './PublishedOffer';
import { UnpublishedOffer } from './UnpublishedOffer';
import { DropZone } from './UploadCertifications';

export const MyOffersDetails = (): JSX.Element => {
	const { tenderId, offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	const offerDocuments = offerData?.offer?.documents;

	const isUnpublished = offerData?.offer?.status === 0;

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{isUnpublished ? (
						<>
							<UnpublishedOffer tenderId={Number(tenderId)} />
							<Flex justifyContent={'flex-end'}>
								<PublishOfferButton
									tenderId={Number(tenderId)}
									offerId={Number(offerId)}
								/>
							</Flex>
						</>
					) : (
						<PublishedOffer offerData={offerData} isOfferLoading={isLoading} />
					)}
					<Box marginTop={'2'}>
						<Box p={4}>
							{/* Maybe we'll move this into the same place as the Unpublished component */}
							<DropZone
								propertyId={0}
								offerId={Number(offerId)}
								tenderId={0}
								projectId={0}
								uploadType={FileUploadType.Offer}
							/>
						</Box>
						<OfferFile offerDocuments={offerDocuments} />
					</Box>
				</>
			)}
		</Box>
	);
};
