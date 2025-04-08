import { Box, Heading, VStack } from '@chakra-ui/react';
import { OtherGigoverFile } from '../../../../Files/new/components/OtherFile';

import { EmptyState } from '../../../../../components/empty/EmptyState';
import { FileUploadType } from '../../../../../models/FileUploadType';
import { DropZone } from '../../../Offers/components/UploadTenderDocuments';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BidDocuments({ bidId, bidDocuments }: { bidId: number; bidDocuments: any }) {
	return (
		<Box>
			<Box p={4}>
				<DropZone
					propertyId={0}
					offerId={0}
					projectId={0}
					uploadType={FileUploadType.Offer}
					tenderId={Number(bidId)}
				/>
			</Box>
			<Heading size={'md'}>Files you added to this Bid</Heading>
			{!bidDocuments || bidDocuments.length === 0 ? (
				<EmptyState
					title={'No files uploaded'}
					text={
						'You have not added any files to this bid. You can add files by dropping them in the box above.'
					}
				/>
			) : (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					{bidDocuments.map((p, pIndex) => (
						<OtherGigoverFile key={pIndex} showDelete={true} file={p} />
					))}
				</VStack>
			)}
		</Box>
	);
}
