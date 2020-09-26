import React, { useContext } from 'react';
import styled from 'styled-components';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import { Edit } from './icons/Edit';
import { ModalContext } from '../context/ModalContext';
import { Theme } from '../Theme';

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

const ProjectCardEdit = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: transparent;
	transition: all 0.2s linear;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: -16px;
	margin-right: -16px;

	&:hover {
		background: ${(props) => props.theme.colors.blueBackground};
	}
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
					<ProjectCardEdit
						onClick={(event) => {
							event.preventDefault();
							setModalContext({ modifyProject: { project } });
						}}
					>
						<Edit size={20} color={Theme.colors.darkLightBlue} />
					</ProjectCardEdit>
				</ProjectCardTitle>
				<div>
					<ProgressBar percent={Math.floor(Math.random() * 101)} />
				</div>
			</ProjectCardStyled>
		</Link>
	);
};
