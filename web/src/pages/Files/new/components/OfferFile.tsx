import { Heading, VStack } from '@chakra-ui/react';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { OtherGigoverFile } from './OtherFile';

export const OfferFile = ({ offerDocuments }): JSX.Element => {
	return (
		<>
			{offerDocuments!.length > 0 ? (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					<Heading size={'md'}>Files for your offer</Heading>
					{offerDocuments!
						.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
						.map((p, pIndex) => (
							<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
						))}
				</VStack>
			) : (
				<EmptyState
					title={'No files uploaded'}
					text={'Upload files to this offer to share them with the client'}
				/>
			)}
		</>
	);
};
