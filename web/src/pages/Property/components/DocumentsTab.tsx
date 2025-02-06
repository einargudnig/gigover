import { Box, Heading, Spacer, Text } from '@chakra-ui/react';
import { PropertyDocument } from '../../../models/Property';
import { PropertyFiles } from './PropertyFiles';

export function DocumentsTab({ documents }: { documents: PropertyDocument[] }): JSX.Element {
	return (
		<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
			<Box>
				<Heading fontSize={'xl'}>Documents</Heading>
			</Box>
			<Spacer />
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
	);
}
