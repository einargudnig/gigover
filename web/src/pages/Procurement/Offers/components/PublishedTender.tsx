import React from 'react';
import { useParams } from 'react-router-dom';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { OtherGigoverFile } from '../../../Files/new/components/OtherFile';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { Heading, VStack } from '@chakra-ui/react';
// import { }

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
								<OtherGigoverFile key={pIndex} file={p} />
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
