import React from 'react';
import { devError } from '../../../utils/ConsoleUtils';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { CreateNewFolder } from '../components/CreateNewFolder';
import { ProjectFolderComponent } from '../components/Folder';
import { FilesUi } from './components/FilesUi';
import { VStack } from '@chakra-ui/react';
import { SimpleGrid } from '../../../components/SimpleGrid';
import { useFolderDocuments } from '../../../queries/useFolderDocuments';
import { useFolderFolders } from '../../../queries/useFolderFolders';

export const FolderFolder = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;
	const folderId = params.folderId ? parseInt(params.folderId) : -1;

	const { data, isLoading, isError, error } = useFolderFolders(projectId, folderId);
	const projectDocuments = useFolderDocuments(folderId);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		devError(error);
		throw new Error('Error loading project folders, Reason: ' + error);
	}

	if (!projectId) {
		return <div>Missing ProjectID</div>;
	}

	return (
		<>
			{!data?.length ? (
				<CreateNewFolder projectId={projectId} folderId={folderId} />
			) : (
				<>
					<VStack mb={4} alignItems={'flex-start'} style={{ width: '100%' }} spacing={4}>
						<SimpleGrid itemWidth={320}>
							{data?.map((folder) => (
								<ProjectFolderComponent
									key={folder.folderId}
									folder={folder}
									projectId={projectId}
								/>
							))}
						</SimpleGrid>
					</VStack>
					<CreateNewFolder projectId={projectId} folderId={folderId} />
				</>
			)}
			<FilesUi title={''} files={projectDocuments?.data ?? []} projectId={projectId} />
		</>
	);
};
