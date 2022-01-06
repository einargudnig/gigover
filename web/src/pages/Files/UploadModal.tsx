import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { FormActions } from '../../components/FormActions';
import { DropZone } from '../../components/DropZone';
import { useProjectList } from '../../queries/useProjectList';
import { TrackerSelect } from '../../components/TrackerSelect';
import { useProjectFolders } from '../../mutations/useProjectFolders';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { useFolderFolders } from '../../queries/useFolderFolders';

interface UploadModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	projectId?: number;
	folderId?: string;
}

const UploadModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

export const UploadModal = ({ projectId, folderId, onClose }: UploadModalProps): JSX.Element => {
	const { data } = useProjectList();
	const { mutateAsync, data: projectFolders } = useProjectFolders();

	const { data: foldersFolders } = useFolderFolders(
		projectId ?? -1,
		folderId ? parseInt(folderId) : -1
	);

	const [selectedProject, setSelectedProject] = useState<number | undefined>(projectId);
	const [selectedFolder, setSelectedFolder] = useState<number | undefined>(
		folderId ? parseInt(folderId) : undefined
	);
	const [isUploading] = useState(false);
	const openProjects = useOpenProjects(data);

	useEffect(() => {
		if (selectedProject) {
			mutateAsync({ projectId: selectedProject }).finally(() => null);
		}
	}, [mutateAsync, selectedProject]);

	return (
		<Modal open={true} onClose={onClose} centerModal={true} title={'Upload file'}>
			<UploadModalStyled>
				<VStack mb={-6} align={'stretch'}>
					{openProjects ? (
						<TrackerSelect
							title={'Select a project'}
							value={selectedProject}
							options={openProjects.map((project) => ({
								label: project.name,
								value: project.projectId
							}))}
							valueChanged={(newValue) => {
								if (newValue === '') {
									setSelectedProject(undefined);
								} else {
									setSelectedProject((newValue as number) ?? undefined);
								}
							}}
						/>
					) : (
						<>
							<Heading>No projects</Heading>
							<Text>
								You do not have any projects, you have to create a project before
								you can upload files.
							</Text>
						</>
					)}
					{folderId && <div>Selected subfolder: {folderId}</div>}
					<TrackerSelect
						title={'Folder'}
						options={
							(foldersFolders ? foldersFolders : projectFolders)?.map((folder) => ({
								label: folder.name,
								value: folder.folderId
							})) ?? []
						}
						valueChanged={(newValue) => {
							if (newValue === '') {
								setSelectedFolder(undefined);
							} else {
								setSelectedFolder((newValue as number) ?? undefined);
							}
						}}
					/>
					{selectedProject && (
						<DropZone projectId={selectedProject} folderId={selectedFolder} />
					)}
					<FormActions
						hideSubmitButton={true}
						cancelText={'Close'}
						cancelDisabled={isUploading}
						onCancel={() => {
							onClose();
						}}
					/>
				</VStack>
			</UploadModalStyled>
		</Modal>
	);
};
