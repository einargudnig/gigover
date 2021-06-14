import { VStack, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { FormActions } from '../../components/FormActions';
import { DropZone } from '../../components/DropZone';
import { useProjectList } from '../../queries/useProjectList';
import { TrackerSelect } from '../../components/TrackerSelect';
import { ProjectStatus } from '../../models/Project';
import { useProjectFolders } from '../../mutations/useProjectFolders';

interface UploadModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	projectId?: number;
}

const UploadModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

export const UploadModal = ({ projectId, onClose }: UploadModalProps): JSX.Element => {
	const { data } = useProjectList();
	const { mutateAsync, data: projectFolders } = useProjectFolders();
	const [selectedProject, setSelectedProject] = useState<number | undefined>(projectId);
	const [selectedFolder, setSelectedFolder] = useState<number | undefined>(undefined);
	const [isUploading] = useState(false);

	const openProjects = useMemo(() => {
		return data.filter((p) => p.status !== ProjectStatus.CLOSED);
	}, [data]);

	useEffect(() => {
		if (selectedProject) {
			mutateAsync({ projectId: selectedProject }).finally(() => null);
		}
	}, [selectedProject]);

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
					<TrackerSelect
						title={'Folder'}
						options={
							projectFolders?.map((folder) => ({
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
