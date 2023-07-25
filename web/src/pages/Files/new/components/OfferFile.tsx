import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { VStack, Text } from '@chakra-ui/react';
import { OtherGigoverFile } from './OtherFile';

export const OfferFile = (): JSX.Element => {
	const params = useParams();
	const offerId = params.offerId ? params.offerId : -1;
	const { data, isLoading, isError, error } = useGetOfferByOfferId(Number(offerId));
	// console.log(data, 'DATA');
	const offerDocuments = data?.offer.documents;

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		console.log(error);
		return <div>Error</div>;
	}

	if (!offerId) {
		return <div>Missing Offer Id</div>;
	}

	return (
		<>
			{offerDocuments!.length > 0 ? (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					{offerDocuments!
						.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
						.map((p, pIndex) => (
							<OtherGigoverFile key={pIndex} file={p} />
						))}
				</VStack>
			) : (
				<div>
					<Text>There are no files here. You need to add files to this offer.</Text>
				</div>
			)}
		</>
	);
};
