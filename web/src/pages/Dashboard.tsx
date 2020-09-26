import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useProjectList } from '../queries/useProjectList';
import { ProjectCard } from '../components/ProjectCard';

const ProjectDashboard = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 16px 0;

	> * {
		margin: 16px;
	}
`;

export const Dashboard = (): JSX.Element => {
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
				{data?.projects.map((project) => (
					<ProjectCard key={project.projectId} project={project} />
				))}
			</ProjectDashboard>
		</Page>
	);
};
