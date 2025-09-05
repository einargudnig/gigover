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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardBaseLink } from '../../../components/CardBase';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { DropZone } from '../../../components/DropZone';
import { FolderIcon } from '../../../components/icons/FolderIcon';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { colorGenerator } from '../../../hooks/colorGenerator';
import { FileUploadType } from '../../../models/FileUploadType';
import { Project } from '../../../models/Project';
import { ProjectFolder } from '../../../models/ProjectFolder';
import { useDeleteFolder } from '../../../mutations/useDeleteFolder';
import { useFolderDocuments } from '../../../queries/useFolderDocuments';
import { humanFileSize } from '../../../utils/FileSizeUtils';

interface FolderProps {
	project: Project;
	url?: string;
}

export const Folder = ({ project, url }: FolderProps): JSX.Element => {
	return (
		<DropZone
			offerId={0}
			tenderId={0}
			projectId={project.projectId}
			uploadType={FileUploadType.Project}
		>
			{({ isDragActive, isUploading }) => (
				<CardBaseLink
					to={`/files/${project.projectId}/${url || ''}`}
					outline={isDragActive ? '3px solid var(--chakra-colors-green)' : 'none'}
					bg={isDragActive ? 'var(--chakra-colors-green)' : 'white'}
					color={isDragActive ? 'white' : 'black'}
					boxShadow={
						isDragActive
							? 'none'
							: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
					}
					_hover={{
						boxShadow: 'none',
						textDecoration: 'none'
					}}
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
				</CardBaseLink>
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
	const { data, isPending } = useFolderDocuments(folder.folderId);

	const isSelected = folder.folderId === selectedFolderId;
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutate } = useDeleteFolder();

	return (
		<div style={{ position: 'relative' }}>
			<div style={{ position: 'absolute', right: '8px', top: '8px' }}>
				<Menu>
					<MenuButton
						as={Button}
						aria-label="More actions"
						size="xs"
						colorScheme={'gray'}
						variant={'outline'}
					>
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
								confirmButtonText="Delete"
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
				offerId={0}
				tenderId={0}
				projectId={projectId}
				folderId={folder.folderId}
				uploadType={FileUploadType.Project}
			>
				{({ isDragActive, isUploading }) => (
					<CardBaseLink
						to={`/files/${projectId}/folder/${folder.folderId}`}
						outline={isDragActive ? '3px solid var(--chakra-colors-green)' : 'none'}
						bg={isDragActive ? 'var(--chakra-colors-green)' : 'white'}
						color={isDragActive ? 'white' : 'black'}
						boxShadow={
							isDragActive
								? 'none'
								: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
						}
						_hover={{
							boxShadow: 'none',
							textDecoration: 'none'
						}}
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
								{isPending ? <LoadingSpinner /> : <Text>{data.length} Files</Text>}
							</HStack>
						</VStack>
					</CardBaseLink>
				)}
			</DropZone>
		</div>
	);
};
