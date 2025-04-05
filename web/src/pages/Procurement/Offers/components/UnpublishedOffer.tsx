import { Box } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { handleFinishDate } from '../../../../utils/HandleFinishDate';
import { TenderTable } from './OfferTable';

export function UnpublishedOffer({ tenderId }) {
	// We need the tender information to show on the offer.
	const { data, isLoading } = useGetTenderById(tenderId);

	const tender = data?.tender;
	const tenderItems = tender?.items;
	const finishDateStatus = handleFinishDate(tender?.finishDate);
	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<TenderTable tenderItems={tenderItems} finishDateStatus={finishDateStatus} />
				</>
			)}
		</Box>
	);
}
