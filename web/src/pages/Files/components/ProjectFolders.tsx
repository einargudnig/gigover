import React from 'react';
import { Button } from '@chakra-ui/react';
import { Project } from '../../../models/Project';
import { devError } from '../../../utils/ConsoleUtils';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { CreateNewFolder, Folder } from './Folder';
import { EmptyState } from '../../../components/empty/EmptyState';
import { useProjectFoldersQuery } from '../../../queries/useProjectFoldersQuery';

interface ProjectFoldersProps {
	project: Project;
}

export const ProjectFolders = ({ project }: ProjectFoldersProps): JSX.Element => {
	const { data, isLoading, isError, error } = useProjectFoldersQuery(project.projectId);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		devError(error);
		throw new Error('Error loading project folders, Reason: ' + error);
	}

	if (data?.length === 0) {
		return (
			<EmptyState
				title={'No folders created'}
				text={'Create a folder for this project'}
				action={
					<>
						<CreateNewFolder projectId={project.projectId} />
					</>
				}
			/>
		);
	}

	return (
		<>
			{data?.map((folder) => (
				<Folder key={folder.folderId} project={project} url={`/${folder.folderId}`} />
			))}
			<CreateNewFolder projectId={project.projectId} />
		</>
	);
};
