import {
	Heading,
	Text,
	VStack,
	Box,
	Button,
	Divider,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { useProjectList } from '../../queries/useProjectList';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { useProjectFolders } from '../../mutations/useProjectFolders';
import { useFolderFolders } from '../../queries/useFolderFolders';
import { TrackerSelect } from '../../components/TrackerSelect';
import { FormActions } from '../../components/FormActions';

interface ProcurementModalProps {
	onClose: () => void;
	onComplete: (status: boolean) => void;
	projectId?: number;
	folderId?: string;
}

const ProjectModalStyled = styled.div`
	@media screen and (max-width: 500px) {
		width: 500px;
	}
`;

export const ProcurementModal = ({
	projectId,
	folderId,
	onClose
}: ProcurementModalProps): JSX.Element => {
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
		// <Modal open={true} onClose={onClose} centerModal={true} title={'Procurement '}>
		// 	<ProjectModalStyled>
		// 		<VStack mb={-6} align={'stretch'}>
		// 			{openProjects ? (
		// 				<TrackerSelect
		// 					title={'Select a project'}
		// 					value={selectedProject}
		// 					options={openProjects.map((project) => ({
		// 						label: project.name,
		// 						value: project.projectId
		// 					}))}
		// 					valueChanged={(newValue) => {
		// 						if (newValue === '') {
		// 							setSelectedProject(undefined);
		// 						} else {
		// 							setSelectedProject((newValue as number) ?? undefined);
		// 						}
		// 					}}
		// 				/>
		// 			) : (
		// 				<>
		// 					<Heading>No projects</Heading>
		// 					<Text>
		// 						You do not have any projects, you have to create a project before
		// 						you can upload files.
		// 					</Text>
		// 				</>
		// 			)}
		// 			{selectedProject && (
		// 				<VStack>
		// 					<Heading>Procurement!</Heading>
		// 					<Text>Here we will add all the info needed for procurement</Text>
		// 				</VStack>
		// 			)}
		// 			<FormActions
		// 				submitText={'Add procurement'}
		// 				onCancel={() => {
		// 					onClose();
		// 				}}
		// 				cancelText={'Discard changes'}
		// 				cancelDisabled={isUploading}
		// 			/>
		// 		</VStack>
		// 	</ProjectModalStyled>
		// </Modal>
		<div>
			{/* {isError && (
        <>
          <p>{error?.errorText</p>
          <small>{error?.errorCode}</small>
        </>
      )} */}
			<form>
				<FormControl>
					<FormLabel>Procurement name</FormLabel>
					<Input name="name" required={true} />
				</FormControl>
				<Box mb={6} />
				<FormControl>
					<FormLabel>Procurement description</FormLabel>
					<Input name="description" required={true} />
				</FormControl>
				<Box mb={6} />
				<FormControl id={'description'} isRequired>
					<FormLabel>Project description</FormLabel>
					<Input name="description" required={true} />
					<FormHelperText>Describe your project</FormHelperText>
				</FormControl>
				<Box mb={6} />
				<FormActions
					submitText={project ? 'Update project' : 'Create a project'}
					submitLoading={isLoading}
					submitDisabled={isLoading}
					cancelText={'Discard changes'}
					onCancel={() => closeModal()}
				/>
			</form>
		</div>
	);
};
