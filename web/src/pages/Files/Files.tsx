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
import { ProjectStatus } from '../../models/Project';
import { SimpleGrid } from '../../components/SimpleGrid';
import { useNavigate, useParams } from 'react-router-dom';
import { File } from './components/File';
import { UploadModal } from './UploadModal';
import { EmptyState } from '../../components/empty/EmptyState';
import { Center } from '../../components/Center';
import { ProjectFile } from '../../models/ProjectFile';
import { useFileService } from '../../hooks/useFileService';
import { FileSidebar } from './components/FileSidebar';
import { useProjectFiles } from '../../queries/useProjectFiles';
import { SearchBar } from './components/SearchBar';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

const SidebarContainer = styled(Container)`
	flex: 0 0 350px;
	background: #fff;
	box-shadow: ${(props) => props.theme.boxShadow()};
`;

export const Files = (): JSX.Element => {
	const params = useParams();
	const navigate = useNavigate();
	const { fileService } = useFileService();
	const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
	const { files, loadingFiles: loadingProjectFiles, setProject } = useProjectFiles();
	const { data, isLoading, loadingFiles, files: recentFiles } = useProjectList(true);
	const projects = data?.projects?.filter((p) => p.status !== ProjectStatus.CLOSED) || [];
	const selectedProject = params.projectId
		? projects.find((p) => p.projectId === parseInt(params.projectId))
		: null;
	const [upload, setUpload] = useState(false);
	const sortedRecentFiles = recentFiles.sort((a, b) =>
		a.created < b.created ? 1 : a.created === b.created ? 0 : -1
	);

	useEffect(() => {
		if (params.projectId && params.fileId) {
			const file = fileService.getProjectFile(parseInt(params.projectId), params.fileId);
			file.then((f) => setSelectedFile(new ProjectFile(f)));
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
						// eslint-disable-next-line no-console
						console.log('status', status);
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
					<Button onClick={() => setUpload(true)} leftIcon={<UploadIcon />}>
						Upload
					</Button>
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
												All folders
											</Heading>
										</HStack>
										{/*<HStack spacing={4}>
											{selectedProject && (
												<Button
													onClick={}
												>
													New folder
												</Button>
											)}
										</HStack>*/}
									</HStack>
									{projects && projects.length > 0 ? (
										<SimpleGrid itemWidth={320}>
											{projects.map((p) => (
												<Folder key={p.projectId} project={p} />
											))}
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
									<HStack
										justifyContent={'space-between'}
										align={'center'}
										mb={4}
										style={{ width: '100%' }}
									>
										<HStack spacing={4}>
											<FolderIcon />
											<Heading as={'h4'} size={'md'}>
												{selectedProject
													? selectedProject.name
													: 'Recent files'}
											</Heading>
										</HStack>
									</HStack>

									{loadingFiles || loadingProjectFiles ? (
										<Center>
											<LoadingSpinner />
										</Center>
									) : (selectedProject && files.length > 0) ||
									  (!selectedProject && sortedRecentFiles.length > 0) ? (
										selectedProject && files ? (
											<VStack
												style={{ width: '100%' }}
												align={'stretch'}
												spacing={4}
											>
												{files.map((p, pIndex) => (
													<File key={pIndex} file={p} />
												))}
											</VStack>
										) : (
											<VStack
												style={{ width: '100%' }}
												align={'stretch'}
												spacing={4}
											>
												{sortedRecentFiles.slice(0, 10).map((p, pIndex) => (
													<File key={pIndex} file={p} />
												))}
											</VStack>
										)
									) : (
										<EmptyState
											title={'No files yet'}
											text={
												'No files have been uploaded yet, you can drop files on to projects to upload them.'
											}
										/>
									)}
								</VStack>
							</Container>
							{selectedFile && (
								<SidebarContainer>
									<FileSidebar
										file={selectedFile}
										onClose={() =>
											navigate('/files/' + (params.projectId || ''))
										}
									/>
								</SidebarContainer>
							)}
						</HStack>
					)}
				</VStack>
			</Page>
		</>
	);
};
