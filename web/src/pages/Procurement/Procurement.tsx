import { HStack, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Page } from '../../components/Page';
// import { PlusIcon } from '../../components/icons/PlusIcon';
import styled from 'styled-components';
import { Outlet, useParams } from 'react-router-dom';
// import { ProcurementHeader } from './components/ProcurementHeader';
import { useProjectList } from '../../queries/useProjectList';
// import { Project } from '../../models/Project';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
// import { CreateNewFolderButton } from '../Files/components/CreateNewFolder';
import { LoadingSpinner } from '../../components/LoadingSpinner';
// import { ProcurementModal } from './ProcurementModal';
// import { devInfo } from '../../utils/ConsoleUtils';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const Procurement = (): JSX.Element => {
	const { data, isLoading } = useProjectList();
	const params = useParams();
	// const [procurement, setProcurement] = useState(null);
	// const [upload, setUpload] = useState(false);
	// const [project, setProject] = useState<Project | null>(null);
	const projects = useOpenProjects(data);

	useEffect(() => {
		if (projects.length > 0 && params.projectId) {
			const findProject = projects.find(
				(p) => p.projectId === parseInt(params.projectId as string)
			);

			if (findProject) {
				// setProject(findProject);
				return;
			}
		}

		// setProject(null);
	}, [projects, params.projectId]);

	return (
		<>
			{/* {upload && (
				// <ProcurementModal
				// 	projectId={project?.projectId || undefined}
				// 	onClose={() => setUpload(false)}
				// 	onComplete={(status) => {
				// 		devInfo('status', status);
				// 	}}
				// />
			)} */}
			<Page
				title={'Procurement'}
				contentPadding={false}
				actions={
					<>
						{/* {project && <CreateNewFolderButton projectId={project.projectId} />}
						<Button onClick={() => setUpload(true)} leftIcon={<PlusIcon />}>
							New Procurement
						</Button> */}
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
