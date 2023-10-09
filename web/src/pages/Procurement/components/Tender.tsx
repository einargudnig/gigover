import React from 'react';
import { ProcurementHeader } from './ProcurementHeader';
import { NewTenderItemTable } from './NewTenderItemTable';
import { useGetTenderById } from '../../../queries/useGetTenderById';
import { useParams } from 'react-router-dom';
import { Tender } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Text } from '@chakra-ui/react';
import { Center } from '../../../components/Center';
import { PublishedTender } from './PublishedTender';

export const TenderPage = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	console.log('tender', tender);

	// const isTenderPublished = tender?.status === 1;
	const isTenderPublished = false;
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
				<div>
					{isTenderPublished ? (
						<>
							<PublishedTender tender={tender} />
						</>
					) : (
						<>
							<ProcurementHeader tender={tender} />
							<NewTenderItemTable tender={tender} />
						</>
					)}
				</div>
			)}
		</>
	);
};
