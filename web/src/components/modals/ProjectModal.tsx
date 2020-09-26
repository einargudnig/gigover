import React from 'react';
import styled from 'styled-components';
import { Project } from '../../models/Project';

interface ProjectModalProps {
	project?: Project;
}

const ProjectModalStyled = styled.div``;

export const ProjectModal = ({ project }: ProjectModalProps): JSX.Element => {
	const isCreating = !project;

	return (
		<ProjectModalStyled>
			<h3>{isCreating ? 'Create a new project' : `Edit ${project!.name}`}</h3>
		</ProjectModalStyled>
	);
};
