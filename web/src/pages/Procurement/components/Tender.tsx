import React from 'react';
import { ProcurementHeader } from './ProcurementHeader';
import { TenderItemTable } from './TenderItemTable';
import { useGetTenderById } from '../../../queries/useGetTenderById';
import { useParams } from 'react-router-dom';
import { Tender } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Text } from '@chakra-ui/react';

export const TenderPage = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	// console.log('tender', tender);
	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : isError ? (
				<Text>
					{error?.errorCode} went wrong - {error?.errorCode}
				</Text>
			) : (
				<div>
					<ProcurementHeader tender={tender} />
					<TenderItemTable tender={tender} />
				</div>
			)}
		</>
	);
};
