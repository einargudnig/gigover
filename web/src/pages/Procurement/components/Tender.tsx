import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TenderWithItems } from '../../../models/Tender';
import { useGetTenderById } from '../../../queries/procurement/useGetTenderById';
import { PublishedTender } from './PublishedTender';
import { UnpublishedTender } from './UnPublishedTender';
// import { TenderFile } from '../../Files/new/components/TenderFile';

export const TenderPage = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: TenderWithItems | undefined = data?.tender;
	// console.log('TenderPage tender: ', tender);

	const isTenderPublished = tender?.status === 1;
	// const isTenderPublished = false;
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
						<PublishedTender tender={tender} />
					) : (
						<UnpublishedTender tender={tender} />
					)}
				</Box>
			)}
		</>
	);
};
