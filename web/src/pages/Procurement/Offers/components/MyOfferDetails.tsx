import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
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
	const { data: offerData, isLoading, isFetching } = useGetOfferByOfferId(Number(offerId));
	const navigate = useNavigate();
	const offerDocuments = offerData?.offer?.documents;
	console.log('offerDocuments', offerDocuments);

	const isUnpublished = offerData?.offer?.status === 0;

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<Button
						onClick={() => navigate(-1)}
						variant={'link'}
						colorScheme={'gray'}
						fontSize={'lg'}
					>
						<ArrowBackIcon />
					</Button>
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
						<OfferFile offerDocuments={offerDocuments ?? []} isFetching={isFetching} />
					</Box>
				</>
			)}
		</Box>
	);
};
