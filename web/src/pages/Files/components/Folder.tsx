import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { CardBaseLink } from '../../../components/CardBase';
import {
	Button,
	Heading,
	HStack,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Text,
	VStack
} from '@chakra-ui/react';
import { Project } from '../../../models/Project';
import { ProjectFolder } from '../../../models/ProjectFolder';
import { humanFileSize } from '../../../utils/FileSizeUtils';
import { DropZone } from '../../../components/DropZone';
import { FileUploadType } from '../../../models/FileUploadType';
import { useFolderDocuments } from '../../../queries/useFolderDocuments';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useDeleteFolder } from '../../../mutations/useDeleteFolder';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../../context/ModalContext';
import { useFolderFolders } from '../../../queries/useFolderFolders';

interface FolderProps {
	project: Project;
	url?: string;
}

const FolderCard = styled(CardBaseLink)<{ isDragActive: boolean; selected?: boolean }>`
	${(props) =>
		props.isDragActive &&
		css`
			outline: 3px solid ${props.theme.colors.green};
		`};

	${(props) =>
		props.selected &&
		css`
			background: #000;
			color: #fff !important;
			box-shadow: none;
		`};
`;

export const Folder = ({ project, url }: FolderProps): JSX.Element => {
	return (
		<DropZone projectId={project.projectId} uploadType={FileUploadType.Project}>
			{({ isDragActive, isUploading }) => (
				<FolderCard
					to={`/files/${project.projectId}/${url || ''}`}
					isDragActive={isDragActive}
				>
					<VStack align={'stretch'} spacing={4}>
						<HStack justify={'space-between'} align={'center'}>
							<FolderIcon
								size={38}
								color={
									colorGenerator(`${project.name}/${url}`, 150, 50)
										.backgroundColor
								}
							/>
							{isUploading && <LoadingSpinner color={'black'} />}
						</HStack>
						<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
							{project.name}
						</Heading>
						<HStack justify={'space-between'}>
							<Text>{project.fileCount || 0} files</Text>
							<Text>{humanFileSize(project.totalBytes || 0)}</Text>
						</HStack>
					</VStack>
				</FolderCard>
			)}
		</DropZone>
	);
};

interface ProjectFolderProps {
	projectId: number;
	folder: ProjectFolder;
	selectedFolderId?: number;
}

export const ProjectFolderComponent = ({
	projectId,
	folder,
	selectedFolderId
}: ProjectFolderProps): JSX.Element => {
	const { data, isLoading } = useFolderDocuments(folder.folderId);
	const { data: folderData, isLoading: folderIsLoading } = useFolderFolders(
		projectId,
		folder.folderId
	);
	const isSelected = folder.folderId === selectedFolderId;
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [, setModalContext] = useContext(ModalContext);
	const { mutate } = useDeleteFolder();

	return (
		<div style={{ position: 'relative' }}>
			<div style={{ position: 'absolute', right: '8px', top: '8px' }}>
				<Menu>
					<MenuButton as={Button} aria-label="More actions" size="xs" color={'black'}>
						...
					</MenuButton>
					<MenuList>
						<MenuGroup title="Actions">
							<ConfirmDialog
								header={'You will delete all files in folder!'}
								setIsOpen={setDialogOpen}
								callback={async (b) => {
									if (b) {
										await mutate({ ...folder, projectId: projectId });
										navigate(`/files/${projectId}`);
									}
									setDialogOpen(false);
								}}
								isOpen={dialogOpen}
							>
								{/*	<MenuItem
									onClick={() => {
										setModalContext({
											shareItem: { folder: folder, project: project }
										});
									}}
								>
									Share folder
								</MenuItem>*/}

								<MenuItem
									onClick={() => {
										setDialogOpen(true);
									}}
								>
									Delete folder
								</MenuItem>
							</ConfirmDialog>
						</MenuGroup>
					</MenuList>
				</Menu>
			</div>

			<DropZone
				projectId={projectId}
				folderId={folder.folderId}
				uploadType={FileUploadType.Project}
			>
				{({ isDragActive, isUploading }) => (
					<FolderCard
						to={`/files/${projectId}/folder/${folder.folderId}`}
						selected={isSelected}
						isDragActive={isDragActive}
					>
						<VStack align={'stretch'} spacing={4}>
							<HStack justify={'space-between'} align={'center'}>
								<FolderIcon
									size={38}
									color={
										colorGenerator(`${folder.name}`, 150, 50).backgroundColor
									}
								/>
								{isUploading && (
									<LoadingSpinner color={isSelected ? 'white' : 'black'} />
								)}
							</HStack>
							<Heading as={'h4'} size={'sm'} fontWeight={'normal'}>
								{folder.name}
							</Heading>
							<HStack justify={'space-between'}>
								{isLoading ? <LoadingSpinner /> : <Text>{data.length} Files</Text>}
							</HStack>
						</VStack>
					</FolderCard>
				)}
			</DropZone>
		</div>
	);
};
