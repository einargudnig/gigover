import React, { useContext } from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useProjectList } from '../queries/useProjectList';
import { ProjectCard } from '../components/ProjectCard';
import { EmptyState } from '../components/empty/EmptyState';
import { EmptyProjects } from '../components/empty/EmptyProjects';
import { Button } from '../components/forms/Button';
import { ModalContext } from '../context/ModalContext';

const ProjectDashboard = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 16px 0;

	> * {
		margin: 16px;
	}
`;

export const Dashboard = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data, isLoading, isError, error } = useProjectList();

	// TODO
	if (isLoading) {
		return <p>Loading projects..</p>;
	}

	if (isError) {
		return (
			<p>
				Error: {error?.errorText} - Code: {error?.errorCode}
			</p>
		);
	}

	return (
		<Page title={'Dashboard'}>
			<ProjectDashboard>
				{(!data || !data.projects || data.projects.length <= 0) && (
					<EmptyState
						icon={<EmptyProjects />}
						title={'No projects found'}
						text={
							'Seems that you haven’t created any projects\n' +
							'for you and your organisation yet. Why don’t you add a new project to your project manager.'
						}
						action={
							<Button onClick={() => setModalContext({ modifyProject: {} })}>
								Create a project
							</Button>
						}
					/>
				)}
				{data?.projects?.map((project) => (
					<ProjectCard key={project.projectId} project={project} />
				))}
			</ProjectDashboard>
		</Page>
	);
};
