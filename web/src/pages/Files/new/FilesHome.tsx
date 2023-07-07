import React from 'react';
import { useProjectList } from '../../../queries/useProjectList';
import { useOpenProjects } from '../../../hooks/useAvailableProjects';
import { Folder } from '../components/Folder';
import { SimpleGrid } from '../../../components/SimpleGrid';
import { VStack } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
// import { TenderFolder } from './TenderFolder';
import { TenderFolder } from '../components/TenderFolder';

export const FilesHome = () => {
	const { data, isLoading } = useProjectList();
	const projects = useOpenProjects(data);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div>
			<VStack alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
				<SimpleGrid itemWidth={320}>
					{projects.map((p) => (
						<Folder key={p.projectId} project={p} />
					))}
					<TenderFolder />
				</SimpleGrid>
			</VStack>
		</div>
	);
};

//Project folders NO FILES
