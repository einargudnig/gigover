import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OfferFile } from './OfferFile';

export function OfferFiles() {
	const params = useParams();
	const offerId = params.offerId ? params.offerId : -1;
	const { data, isPending, isError, error, isFetching } = useGetOfferByOfferId(Number(offerId));
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
			{isPending ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<OfferFile offerDocuments={offerDocuments ?? []} isFetching={isFetching} />
			)}
		</Box>
	);
}
