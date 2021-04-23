import {
	Button,
	Heading,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { UploadIcon } from '../../components/icons/UploadIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
import styled from 'styled-components';
import { FolderIcon } from '../../components/icons/FolderIcon';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { Folder } from './components/Folder';
import { ProjectStatus } from '../../models/Project';
import { SimpleGrid } from '../../components/SimpleGrid';
import { useParams } from 'react-router-dom';
import { ProjectFile } from '../../models/ProjectFile';
import { File } from './components/File';
import { UploadModal } from './UploadModal';

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

const FakeFiles = [
	new ProjectFile('asdf', 1024, 1924812967032, 'txt', 'Document', 1052),
	new ProjectFile('asdf', 1024, 1924812967032, 'txt', 'Document', 1052),
	new ProjectFile('asdf', 1024, 1924812967032, 'txt', 'Document', 1052),
	new ProjectFile('asdf', 1024, 1924812967032, 'txt', 'Document', 1052)
];

export const Files = (): JSX.Element => {
	const params = useParams();
	const [selectedFile, setSelectedFile] = useState(!!params.fileId);
	const { data, isLoading } = useProjectList();
	const projects = data?.projects?.filter((p) => p.status !== ProjectStatus.CLOSED) || [];
	const selectedProject = params.projectId
		? projects.find((p) => p.projectId === parseInt(params.projectId))
		: null;
	const [upload, setUpload] = useState(false);

	// const list = useMemo(async () => {
	// 	if (selectedProject) {
	// 		return await getFilesForProject(selectedProject.projectId);
	// 	} else {
	// 		return await getFilesForProjects(projects.map((p) => p.projectId));
	// 	}
	// }, [selectedProject]);
	//
	// // eslint-disable-next-line no-console
	// console.log('list', list);

	useEffect(() => {
		if (params.fileId) {
			setSelectedFile(!!params.fileId);
		} else {
			setSelectedFile(false);
		}
	}, [params.fileId]);

	return (
		<>
			{upload && (
				<UploadModal
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
				tabs={
					<InputGroup>
						<Input
							name="search"
							placeholder="Search file system"
							variant={'filled'}
							style={{ minWidth: '400px' }}
						/>
						<InputRightElement pointerEvents={'none'}>
							<SearchIcon />
						</InputRightElement>
					</InputGroup>
				}
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
												All files
											</Heading>
										</HStack>
										<HStack spacing={4}>
											{selectedProject && (
												<Button
													onClick={() => setSelectedFile(!selectedFile)}
												>
													New folder
												</Button>
											)}
										</HStack>
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
												Recent files
											</Heading>
										</HStack>
									</HStack>
									{FakeFiles && FakeFiles.length > 0 ? (
										<VStack
											style={{ width: '100%' }}
											align={'stretch'}
											spacing={4}
										>
											{FakeFiles.map((p, pIndex) => (
												<File key={pIndex} file={p} />
											))}
										</VStack>
									) : (
										<p>TODO: No files</p>
									)}
								</VStack>
							</Container>
							{selectedFile && (
								<SidebarContainer>
									<p>A file has been selected.</p>
								</SidebarContainer>
							)}
						</HStack>
					)}
				</VStack>
			</Page>
		</>
	);
};
