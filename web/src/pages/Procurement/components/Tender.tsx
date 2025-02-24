import { Heading, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/empty/EmptyState';
import { TenderWithItems } from '../../../models/Tender';
import { useGetTenderById } from '../../../queries/procurement/useGetTenderById';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';
import { NewTenderItemTable } from './NewTenderItemTable';
import { ProcurementHeader } from './ProcurementHeader';
import { PublishedTender } from './PublishedTender';
// import { TenderFile } from '../../Files/new/components/TenderFile';

export const TenderPage = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	const tender: TenderWithItems | undefined = data?.tender;
	// console.log('TenderPage tender: ', tender);
	const tenderDocuments = tender?.documents;

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
							<div>
								{tenderDocuments!.length > 0 ? (
									<VStack
										style={{ width: '100%' }}
										align={'stretch'}
										spacing={4}
										mt={4}
									>
										<Heading size={'md'}>
											Files you added to this Tender
										</Heading>
										{tenderDocuments!
											.sort((a, b) =>
												b.created && a.created ? b.created - a.created : -1
											)
											.map((p, pIndex) => (
												<OtherGigoverFile
													key={pIndex}
													showDelete={true}
													file={p}
												/>
											))}
									</VStack>
								) : (
									<EmptyState
										title={'No files uploaded'}
										text={
											'You have not added any files to this tender. You can add files by clicking the Upload files button'
										}
									/>
								)}
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};
