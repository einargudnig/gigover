import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTenderById } from '../../../../queries/useGetTenderById';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { VStack, Text } from '@chakra-ui/react';
import { OtherGigoverFile } from './OtherFile';

export const TenderFile = (): JSX.Element => {
	const params = useParams();
	const tenderId = params.tenderId ? params.tenderId : -1;
	const { data, isLoading, isError, error } = useGetTenderById(Number(tenderId));
	// console.log(data, 'DATA');
	const tenderDocuments = data?.tender.documents;

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		console.log(error);
		return <div>Error</div>;
	}

	if (!tenderId) {
		return <div> Missing Tender Id</div>;
	}

	return (
		<>
			{tenderDocuments!.length > 0 ? (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					{tenderDocuments!
						.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
						.map((p, pIndex) => (
							<OtherGigoverFile key={pIndex} file={p} />
						))}
				</VStack>
			) : (
				<div>
					<Text>
						There are no files here. The bidders have not added files to any of the
						offers.
					</Text>
				</div>
			)}
		</>
	);
};
