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
// import { TenderFile } from '../../Files/new/components/TenderFile';

export const TenderPage = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
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
				<div>
					{isTenderPublished ? (
						<>
							<PublishedTender tender={tender} />
						</>
					) : (
						<>
							<ProcurementHeader tender={tender} />
							<NewTenderItemTable tender={tender} />
							{/*
									Files for this Tender
									I will need to change this a bit!
									This is TenderFiles from Bidders on this tender.
									I want to get them from Tender Owner for this Tender
									I can either re-use the component or create a new one.
							*/}
							{/* <TenderFile /> */}
						</>
					)}
				</div>
			)}
		</>
	);
};
