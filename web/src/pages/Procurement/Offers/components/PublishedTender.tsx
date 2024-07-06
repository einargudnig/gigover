import { Heading, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { PublishedOffer } from './PublishedOffer';

export const PublishedTender = (): JSX.Element => {
	// ! This is the page for the tender owner to see the published offers
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));
	const offerDocuments = offerData?.offer?.documents;

	return (
		<>
			<PublishedOffer
				offerData={offerData}
				isOfferLoading={isLoading}
				showResultsButtons={true}
			/>
			{offerDocuments ? (
				offerDocuments.length > 0 ? (
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
						<Heading size={'md'}>Files added to this offer</Heading>
						{offerDocuments!
							.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
							.map((p, pIndex) => (
								<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
							))}
					</VStack>
				) : (
					<EmptyState
						title={'No files uploaded'}
						text={'No files have been uploaded to this offer'}
					/>
				)
			) : (
				<EmptyState
					title={'No files found!'}
					text={'There might be an error fetching the files. Please contact support.'}
				/>
			)}
		</>
	);
};
