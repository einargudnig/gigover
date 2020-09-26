import React from 'react';
import styled from 'styled-components';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
	project: Project;
}

const ProjectCardStyled = styled.div`
	width: 440px;
	height: 220px;
	border-radius: 12px;
	background: #fff;
	box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.03);
	padding: 24px;
	transition: all 0.2s linear;

	&:hover {
		box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.1);
	}

	h3 {
		margin-bottom: 16px;
		color: #000;
	}
`;

export const ProjectCard = ({ project }: ProjectCardProps): JSX.Element => {
	return (
		<Link to={`/project/${project.projectId}`}>
			<ProjectCardStyled>
				<h3>{project.name}</h3>
				<p>{project.description}</p>
			</ProjectCardStyled>
		</Link>
	);
};
