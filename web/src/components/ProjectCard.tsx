import React, { useContext } from 'react';
import styled from 'styled-components';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { Edit } from './icons/Edit';
import { ModalContext } from '../context/ModalContext';

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
	display: flex;
	justify-content: space-between;
	flex-direction: column;

	&:hover {
		box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.1);
	}

	h3 {
		margin-bottom: 16px;
		color: #000;
	}
`;

const ProjectCardTitle = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const ProjectCard = ({ project }: ProjectCardProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<Link to={`/project/${project.projectId}`}>
			<ProjectCardStyled>
				<ProjectCardTitle>
					<div>
						<h3>{project.name}</h3>
						<p>{project.description}</p>
					</div>
					<div
						onClick={(event) => {
							setModalContext({ modifyProject: { project } });
						}}
					>
						<Edit size={24} />
					</div>
				</ProjectCardTitle>
				<div>
					<ProgressBar percent={Math.floor(Math.random() * 101)} />
				</div>
			</ProjectCardStyled>
		</Link>
	);
};
