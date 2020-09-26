import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '../queries/useProjectDetails';

const ProjectDetailsStyled = styled.div``;

export const ProjectDetails = (): JSX.Element => {
	const { projectId } = useParams();
	const { data, isLoading, isError, error } = useProjectDetails(parseInt(projectId));
	const project = (data && data.project) ?? { name: 'Invalid' };

	return (
		<Page breadcrumbs={[project.name, 'Tasks']}>
			<ProjectDetailsStyled>
				{isLoading ? (
					<p>Loading</p>
				) : isError ? (
					<p>
						Error fetching project with id: {projectId} - Reason: {error?.errorText}.
						Code: {error?.errorCode}
					</p>
				) : (
					<h1>Project: {project.name}</h1>
				)}
			</ProjectDetailsStyled>
		</Page>
	);
};
