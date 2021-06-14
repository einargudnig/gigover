import { Button, Heading, HStack, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { UploadIcon } from '../../components/icons/UploadIcon';
import styled from 'styled-components';
import { FolderIcon } from '../../components/icons/FolderIcon';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { Folder } from './components/Folder';
import { Project, ProjectStatus } from '../../models/Project';
import { SimpleGrid } from '../../components/SimpleGrid';
import { useNavigate, useParams } from 'react-router-dom';
import { File } from './components/File';
import { UploadModal } from './UploadModal';
import { EmptyState } from '../../components/empty/EmptyState';
import { Center } from '../../components/Center';
import { useFileService } from '../../hooks/useFileService';
import { useProjectFiles } from '../../queries/useProjectFiles';
import { SearchBar } from './components/SearchBar';
import { EditPhotoModal } from '../../components/modals/EditPhotoModal';
import { FilePdfIcon } from '../../components/icons/FileTypes/FilePdfIcon';
import { ProjectFolders } from './components/ProjectFolders';
import { devInfo } from '../../utils/ConsoleUtils';
import { CreateNewFolderButton } from './components/CreateNewFolder';
import { FolderFiles } from './components/FolderFiles';
import { ProjectImage } from '../../models/ProjectImage';
import { FileDocument } from '../../services/FileSystemService';
import { useFolderDocuments } from '../../queries/useFolderDocuments';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Files = (): JSX.Element => {
	const params = useParams();
	const navigate = useNavigate();
	const { fileService } = useFileService();
	const [selectedFile, setSelectedFile] = useState<ProjectImage | null>(null);
	const { files, loadingFiles: loadingProjectFiles, setProject } = useProjectFiles();
	console.log(files, 'files-----------');
	const { data, isLoading, loadingFiles, files: recentFiles } = useProjectList(true);

	const { data: testData } = useFolderDocuments(parseInt(params.folderId));

	console.log(testData, 'testData');
	const projects = data?.projects?.filter((p) => p.status !== ProjectStatus.CLOSED) || [];
	const selectedProject: Project | null | undefined = params.projectId
		? projects.find((p) => p.projectId === parseInt(params.projectId))
		: null;
	const [upload, setUpload] = useState(false);
	const sortedRecentFiles = recentFiles.sort((a, b) => {
		return a.created && b.created
			? a.created < b.created
				? 1
				: a.created === b.created
				? 0
				: -1
			: -1;
	});

	useEffect(() => {
		if (params.projectId && params.fileId) {
			const s: ProjectImage | undefined = testData.find(
				(c) => c.imageId === parseInt(params.fileId)
			);
			if (s) {
				setSelectedFile(s);
			}
		} else {
			setSelectedFile(null);
		}
	}, [params]);

	useEffect(() => {
		setProject(selectedProject || null);
	}, [selectedProject]);

	return (
		<>
			{upload && (
				<UploadModal
					projectId={selectedProject?.projectId || undefined}
					onClose={() => {
						setUpload(false);
					}}
					onComplete={(status) => {
						devInfo('status', status);
					}}
				/>
			)}
			<Page
				title={'Files'}
				breadcrumbs={[
					{ title: 'Your files', url: '/files/' },
					...(selectedProject
						? [
								{
									title: selectedProject.name,
									url: '/files/' + selectedProject.projectId
								},
								...(params.fileId
									? [
											{
												title: 'File',
												url:
													'/files/' +
													selectedProject.projectId +
													'/file/' +
													params.fileId
											}
									  ]
									: [])
						  ]
						: [])
				]}
				tabs={<SearchBar files={sortedRecentFiles} />}
				contentPadding={false}
				actions={
					<>
						{selectedProject && (
							<CreateNewFolderButton projectId={selectedProject.projectId} />
						)}
						<Button onClick={() => setUpload(true)} leftIcon={<UploadIcon />}>
							Upload
						</Button>
					</>
				}
			>
				<VStack style={{ height: '100%' }}>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
							<Container>
								<VStack
									alignItems={'flex-start'}
									style={{ width: '100%' }}
									spacing={4}
								>
									<HStack
										justifyContent={'space-between'}
										align={'center'}
										mb={4}
										style={{ width: '100%' }}
									>
										<HStack spacing={4}>
											<FolderIcon />
											<Heading as={'h4'} size={'md'}>
												{!selectedProject
													? 'All folders'
													: selectedProject.name}
											</Heading>
										</HStack>
									</HStack>
									{projects && projects.length > 0 ? (
										<SimpleGrid itemWidth={320}>
											{!selectedProject ? (
												projects.map((p) => (
													<Folder key={p.projectId} project={p} />
												))
											) : (
												<ProjectFolders
													project={selectedProject}
													selectedFolderId={
														params.folderId
															? parseInt(params.folderId)
															: undefined
													}
												/>
											)}
										</SimpleGrid>
									) : (
										<NoProjectsFound />
									)}
								</VStack>
								<VStack
									mt={8}
									alignItems={'flex-start'}
									style={{ width: '100%' }}
									spacing={4}
								>
									{
										selectedProject &&
											params.folderId && (
												<>
													<FolderFiles
														project={selectedProject}
														folderId={parseInt(params.folderId)}
													/>
												</>
											) /*: (
										<>
											<EmptyState
												title={'No files yet'}
												text={
													'No files have been uploaded yet, you can drop files on to projects or folders to upload them.'
												}
											/>
										</>
									)*/
									}
								</VStack>
							</Container>
						</HStack>
					)}
				</VStack>
				{selectedFile && (
					<EditPhotoModal
						projectId={selectedProject?.projectId}
						file={selectedFile}
						onClose={() => navigate(-1)}
					/>
				)}
			</Page>
		</>
	);
};
