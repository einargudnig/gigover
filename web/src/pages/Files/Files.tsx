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
import { Project } from '../../models/Project';
import { SimpleGrid } from '../../components/SimpleGrid';
import { useParams } from 'react-router-dom';
import { UploadModal } from './UploadModal';
import { SearchBar } from './components/SearchBar';
import { ProjectFolders } from './components/ProjectFolders';
import { devInfo } from '../../utils/ConsoleUtils';
import { CreateNewFolderButton } from './components/CreateNewFolder';
import { FolderFiles } from './components/FolderFiles';
import { ProjectFiles } from './components/ProjectFiles';
import { useOpenProjects } from '../../hooks/useAvailableProjects';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Files = (): JSX.Element => {
	const { data, isLoading } = useProjectList();
	const params = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [upload, setUpload] = useState(false);
	const projects = useOpenProjects(data);

	useEffect(() => {
		if (projects.length > 0 && params.projectId) {
			const findProject = projects.find(
				(p) => p.projectId === parseInt(params.projectId as string)
			);

			if (findProject) {
				setProject(findProject);
				return;
			}
		}

		setProject(null);
	}, [projects, params.projectId]);

	return (
		<>
			{upload && (
				<UploadModal
					projectId={project?.projectId || undefined}
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
					...(project
						? [
								{
									title: project.name,
									url: '/files/' + project.projectId
								},
								...(params.fileId
									? [
											{
												title: 'File',
												url:
													'/files/' +
													project.projectId +
													'/file/' +
													params.fileId
											}
									  ]
									: [])
						  ]
						: [])
				]}
				tabs={<SearchBar files={[]} />}
				contentPadding={false}
				actions={
					<>
						{project && <CreateNewFolderButton projectId={project.projectId} />}
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
												{!project ? 'All folders' : project.name}
											</Heading>
										</HStack>
									</HStack>
									{projects && projects.length > 0 ? (
										<SimpleGrid itemWidth={320}>
											{!project ? (
												projects.map((p) => (
													<Folder key={p.projectId} project={p} />
												))
											) : (
												<ProjectFolders
													project={project}
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
									{project && (
										<>
											{params.folderId ? (
												<>
													<FolderFiles
														project={project}
														folderId={parseInt(params.folderId)}
													/>
												</>
											) : (
												<ProjectFiles project={project} />
											)}
										</>
									)}
								</VStack>
							</Container>
						</HStack>
					)}
				</VStack>
			</Page>
		</>
	);
};
