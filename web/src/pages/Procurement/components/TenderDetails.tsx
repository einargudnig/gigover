import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TenderWithItems } from '../../../models/Tender';
import { useGetTenderById } from '../../../queries/procurement/useGetTenderById';
import { PublishedTender } from './PublishedTender';
import { UnpublishedTender } from './UnPublishedTender';

export const TenderDetails = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: TenderWithItems | undefined = data?.tender;

	const isTenderPublished = tender?.status === 1;
	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : isError ? (
				<Text>
					{error?.errorCode} went wrong - {error?.errorCode}
				</Text>
			) : (
				<Box>
					{isTenderPublished ? (
						<PublishedTender tender={tender} getTenderLoading={isLoading} />
					) : (
						<UnpublishedTender tender={tender} getTenderLoading={isLoading} />
					)}
				</Box>
			)}
		</>
	);
};
