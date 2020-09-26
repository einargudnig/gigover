import React from 'react';
import styled from 'styled-components';
import { Page } from '../components/Page';
import { useParams } from 'react-router-dom';

const ProjectDetailsStyled = styled.div``;

export const ProjectDetails = (): JSX.Element => {
	const { projectId } = useParams();

	console.log(projectId);

	return (
		<Page title={'Project details'}>
			<ProjectDetailsStyled>
				<h1>Project Id: {projectId}</h1>
			</ProjectDetailsStyled>
		</Page>
	);
};
