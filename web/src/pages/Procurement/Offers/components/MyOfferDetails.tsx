import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { FileUploadType } from '../../../../models/FileUploadType';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { OfferFile } from '../../../Files/new/components/OfferFile';
import { Info } from '../../components/Info';
import { PublishOfferButton } from './PublishOfferButton';
import { PublishedOffer } from './PublishedOffer';
import { UnpublishedOffer } from './UnpublishedOffer';
import { DropZone } from './UploadCertifications';

export const MyOffersDetails = (): JSX.Element => {
	const { tenderId, offerId } = useParams();
	const { data: offerData, isPending, isFetching } = useGetOfferByOfferId(Number(offerId));
	const { data: tenderData } = useGetTenderById(Number(tenderId));
	const tender = tenderData?.tender;
	const finishDateStatus = handleFinishDate(tender?.finishDate);
	const navigate = useNavigate();

	const offerDocuments = offerData?.offer?.documents;
	const isUnpublished = offerData?.offer?.status === 0;

	const tenderFields = [
		{ label: 'Description', value: tender?.description },
		{ label: 'Terms', value: tender?.terms },
		{ label: 'Address', value: tender?.address },
		{ label: 'Delivery', value: tender?.delivery ? 'Yes' : 'No' },
		{ label: 'Close date', value: tender?.finishDate },
		{ label: 'Phone', value: tender?.phoneNumber }
	];

	return (
		<Box p={4}>
			{isPending ? (
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
							<Info fields={tenderFields} />
							<UnpublishedOffer tenderId={Number(tenderId)} />
							<Flex justifyContent={'flex-end'}>
								<PublishOfferButton
									tenderId={Number(tenderId)}
									offerId={Number(offerId)}
									finishDateStatus={finishDateStatus}
								/>
							</Flex>
						</>
					) : (
						<PublishedOffer offerData={offerData} isOfferLoading={isPending} />
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
