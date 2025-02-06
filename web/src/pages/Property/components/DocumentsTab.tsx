import { Box, Button, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { PropertyDocument } from '../../../models/Property';
import { PropertyFiles } from './PropertyFiles';
import { useState } from 'react';
import { UploadPropertyDocuments } from './UploadPropertyDocuments';

export function DocumentsTab({
	propertyId,
	documents
}: {
	propertyId: number;
	documents: PropertyDocument[];
}): JSX.Element {
	const [upload, setUpload] = useState(false);
	return (
		<>
			{upload && (
				<UploadPropertyDocuments
					onClose={() => setUpload(false)}
					onComplete={(status) => {
						console.log('status', status);
					}}
					propertyId={propertyId}
				/>
			)}
			<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
				<Flex mb={8} alignItems={'center'} justify={'space-between'}>
					<Box>
						<Heading fontSize={'xl'}>Documents</Heading>
					</Box>
					<Spacer />
					<Button variant="outline" colorScheme="black" onClick={() => setUpload(true)}>
						Upload files
					</Button>
				</Flex>
				{!documents || documents.length === 0 ? (
					<Text m={4}>No projects!</Text>
				) : (
					documents
						?.sort((a, b) => (b.created && a.created ? b.created - a.created : -1))
						.map((document, pIndex) => (
							<Box key={pIndex} p={1} m={1}>
								<PropertyFiles showDelete={true} file={document} />
							</Box>
						))
				)}
			</Box>
		</>
	);
}
