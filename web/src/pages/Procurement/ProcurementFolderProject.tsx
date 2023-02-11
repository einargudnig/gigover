import React from 'react';
import { useParams } from 'react-router-dom';
import { Spacer, VStack } from '@chakra-ui/react';
import { SimpleGrid } from '../../components/SimpleGrid';

export const ProcurementFolderProject = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;

	return (
		<>
			<VStack mb={4} alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
				<SimpleGrid itemWidth={320}>
					<div>FILESUI.TSX</div>
				</SimpleGrid>
			</VStack>
			<Spacer height={4} />
		</>
	);
};
