import React from 'react';
import { ProcurementHeader } from './ProcurementHeader';
// import { TenderItemTable } from './TenderItemTable';
import { NewTenderItemTable } from './NewTenderItemTable';
import { useGetTenderById } from '../../../queries/useGetTenderById';
import { useParams, Link } from 'react-router-dom';
import { Tender } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Text, Box, Button } from '@chakra-ui/react';
import { Center } from '../../../components/Center';
import { TenderFile } from '../../Files/new/components/TenderFile';

export const TenderPage = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: Tender | undefined = data?.tender;
	console.log('tender', tender);

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
				<div>
					<ProcurementHeader tender={tender} />
					<NewTenderItemTable tender={tender} />
					{/* <TenderItemTable tender={tender} /> */}
					{/* Files for this tender */}
					{isTenderPublished ? (
						<>
							<Box marginTop={'2'}>
								<TenderFile />
							</Box>
							<Box marginTop={'3'}>
								<Link to={`/files/tender/tenders/${tenderId}`}>
									<Button ml={'1'}>
										<Text textColor={'black'}>View files</Text>
									</Button>
								</Link>
							</Box>
						</>
					) : null}
				</div>
			)}
		</>
	);
};
