import React from 'react';
import { Project } from '../../../models/Project';
import { devError } from '../../../utils/ConsoleUtils';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ProjectFolderComponent } from './Folder';
import { EmptyState } from '../../../components/empty/EmptyState';
import { useProjectFoldersQuery } from '../../../queries/useProjectFoldersQuery';
import { CreateNewFolder } from './CreateNewFolder';

interface ProjectFoldersProps {
	project: Project;
	selectedFolderId?: number;
}

export const ProjectFolders = ({ selectedFolderId, project }: ProjectFoldersProps): JSX.Element => {
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
				action={<CreateNewFolder projectId={project.projectId} />}
			/>
		);
	}

	return (
		<>
			{data?.map((folder) => (
				<ProjectFolderComponent
					key={folder.folderId}
					folder={folder}
					project={project}
					selectedFolderId={selectedFolderId}
				/>
			))}
			<CreateNewFolder projectId={project.projectId} />
		</>
	);
};
