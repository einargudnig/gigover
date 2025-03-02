import { Box, Heading, VStack } from '@chakra-ui/react';
import { ProcurementHeader } from './ProcurementHeader';
import { NewTenderItemTable } from './NewTenderItemTable';
import { TenderDocument } from '../../../models/TenderDocument';
import { EmptyState } from '../../../components/empty/EmptyState';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';

export function UnpublishedTender({ tender }): JSX.Element {
	const tenderDocuments: TenderDocument[] | undefined = tender?.documents || [];
	return (
		<Box p={4}>
			<ProcurementHeader tender={tender} />
			<NewTenderItemTable tender={tender} />
			<Box>
				{tenderDocuments!.length > 0 ? (
					<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
						<Heading size={'md'}>Files you added to this Tender</Heading>
						{tenderDocuments?.map((p, pIndex) => (
							<OtherGigoverFile key={pIndex} showDelete={true} file={p} />
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
			</Box>
		</Box>
	);
}
