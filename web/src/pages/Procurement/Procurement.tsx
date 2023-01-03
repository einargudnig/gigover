import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
// import { Project } from '../../models/Project';
import { Outlet } from 'react-router-dom';
import { ProcurementModal } from '../../components/modals/ProcurementModal';
// import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { PlusIcon } from '../../components/icons/PlusIcon';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const { data, isLoading } = useProjectList();
	// const [project, setProject] = useState<Project | null>(null);
	const [upload, setUpload] = useState(false);
	// const projects = useOpenProjects(data);

	return (
		<>
			{upload && (
				// <UploadModal
				// 	projectId={project?.projectId || undefined}
				// 	folderId={params?.folderId || undefined}
				// 	onClose={() => {
				// 		setUpload(false);
				// 	}}
				// 	onComplete={(status) => {
				// 		devInfo('status', status);
				// 	}}
				// />
				<ProcurementModal />
			)}
			<Page
				title={'Procurement'}
				breadcrumbs={[
					{ title: 'Your procurement', url: '/procurement/' }
					// ...(project
					// 	? [
					// 			{
					// 				title: project.name,
					// 				url: '/procurement/' + project.projectId
					// 			},
					// 			...(params.fileId
					// 				? [
					// 						{
					// 							title: '/**/File',
					// 							url:
					// 								'/procurement/' +
					// 								project.projectId +
					// 								'/procurement/' +
					// 								params.fileId
					// 						}
					// 				  ]
					// 				: [])
					// 	  ]
					// 	: [])
				]}
				contentPadding={false}
				actions={
					<>
						<Button onClick={() => setUpload(true)} leftIcon={<PlusIcon />}>
							New Procurement
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
								<Outlet />
							</Container>
						</HStack>
					)}
				</VStack>
			</Page>
		</>
	);
};
