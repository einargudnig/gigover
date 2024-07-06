import { Spacer, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { SimpleGrid } from '../../../components/SimpleGrid';
import { useProjectDocuments } from '../../../queries/useProjectDocuments';
import { useProjectFoldersQuery } from '../../../queries/useProjectFoldersQuery';
import { devError } from '../../../utils/ConsoleUtils';
import { CreateNewFolder } from '../components/CreateNewFolder';
import { ProjectFolderComponent } from '../components/Folder';
import { FilesUi } from './components/FilesUi';

export const ProjectFolder = (): JSX.Element => {
	const params = useParams();
	const projectId = params.projectId ? parseInt(params.projectId) : -1;

	const { data, isLoading, isError, error } = useProjectFoldersQuery(projectId);
	const projectDocuments = useProjectDocuments(projectId);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		devError(error);
		throw new Error('Error loading project folders, Reason: ' + error);
	}

	if (!projectId) {
		return <div>Missing Project Id</div>;
	}

	return (
		<>
			{!data?.length ? (
				<CreateNewFolder projectId={projectId} />
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
					<CreateNewFolder projectId={projectId} />
				</>
			)}

			<Spacer height={4} />
			<FilesUi title={''} files={projectDocuments?.data ?? []} projectId={projectId} />
		</>
	);
};
