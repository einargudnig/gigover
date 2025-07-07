import { Heading, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetTenderById } from '../../../../queries/procurement/useGetTenderById';
import { OtherGigoverFile } from './OtherFile';

export const TenderFile = (): JSX.Element => {
	const params = useParams();
	const tenderId = params.tenderId ? params.tenderId : -1;
	const { data, isPending, isError, error } = useGetTenderById(Number(tenderId));
	const tenderDocuments = data?.tender.documents;

	if (isError && error) {
		console.log(error);
		return <div>Error</div>;
	}

	if (!tenderId) {
		return <div> Missing Tender Id</div>;
	}

	return (
		<>
			{isPending ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{tenderDocuments!.length > 0 ? (
						<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
							<Heading size={'md'}>Files for your tender</Heading>
							{tenderDocuments!
								.sort((a, b) =>
									b.created && a.created ? b.created - a.created : -1
								)
								.map((p, pIndex) => (
									<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
								))}
						</VStack>
					) : (
						<div>
							<Text>
								There are no files here. The bidders have not added files to any of
								the offers.
							</Text>
						</div>
					)}
				</>
			)}
		</>
	);
};
