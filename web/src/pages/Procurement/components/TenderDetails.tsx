import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
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
	const navigate = useNavigate();
	const isTenderPublished = tender?.status === 1;

	return (
		<Box p={4}>
			<Button
				onClick={() => navigate(-1)}
				variant={'link'}
				colorScheme={'gray'}
				fontSize={'lg'}
			>
				<ArrowBackIcon />
			</Button>
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
		</Box>
	);
};
