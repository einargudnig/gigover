import { Box } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { OfferFile } from './OfferFile';
import { useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';

export function OfferFiles() {
	const params = useParams();
	const offerId = params.offerId ? params.offerId : -1;
	const { data, isLoading, isError, error } = useGetOfferByOfferId(Number(offerId));
	const offerDocuments = data?.offer.documents;

	if (isError && error) {
		console.log(error);
		return <div>Error</div>;
	}

	if (!offerId) {
		return <div>Missing Offer Id</div>;
	}

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<OfferFile offerDocuments={offerDocuments} />
			)}
		</Box>
	);
}
