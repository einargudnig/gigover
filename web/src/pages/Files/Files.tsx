import { Button, HStack, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { Project } from '../../models/Project';
import { useProjectList } from '../../queries/useProjectList';
import { UploadModal } from './UploadModal';
// import { devInfo } from '../../utils/ConsoleUtils';
import { DisabledComponent } from '../../components/disabled/DisabledComponent';
import { DisabledPage } from '../../components/disabled/DisbledPage';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { CreateNewFolderButton } from './components/CreateNewFolder';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Files = (): JSX.Element => {
	const { data, isPending } = useProjectList();
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
					folderId={params?.folderId || undefined}
					onClose={() => {
						setUpload(false);
					}}
					onComplete={(status) => {
						// devInfo('status', status);
						console.log('status', status);
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
												title: '/**/File',
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
				contentPadding={false}
				actions={
					<DisabledComponent>
						{project && <CreateNewFolderButton projectId={project.projectId} />}
						<Button onClick={() => setUpload(true)}>Upload</Button>
					</DisabledComponent>
				}
			>
				<DisabledPage>
					<VStack style={{ height: '100%' }}>
						{isPending ? (
							<LoadingSpinner />
						) : (
							<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
								<Container>
									<Outlet />
								</Container>
							</HStack>
						)}
					</VStack>
				</DisabledPage>
			</Page>
		</>
	);
};
