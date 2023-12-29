import React, { useContext } from 'react';
import styled from 'styled-components';
import { Project } from '../models/Project';
import { ProgressBar } from './ProgressBar';
import { Edit } from './icons/Edit';
import { ModalContext } from '../context/ModalContext';
import { Theme } from '../Theme';
import { TaskStatus } from '../models/Task';
import { CardBaseLink } from './CardBase';
import { ProjectTimeStatus } from './ProjectTimeStatus';
import { ToolsIcon } from './icons/ToolsIcon';
import { HStack } from '@chakra-ui/react';
import { PropertyIcon } from './icons/PropertyIcon';
import { useGetProperties } from '../queries/properties/useGetPoperties';

interface ProjectCardProps {
	project: Project;
}

const ProjectCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	margin-bottom: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
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

const ProjectCardProperty = styled.div`
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

const ProjectCardActions = styled.div`
	display: flex;
`;

export const ProjectCard = React.memo(({ project }: ProjectCardProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	const { data: properties } = useGetProperties();

	const tasks = project.tasks.filter((task) => task.status !== TaskStatus.Archived) || [];
	const completed = tasks.filter((task) => task.status === TaskStatus.Done);
	const inProgress = tasks.filter((task) => task.status === TaskStatus.Doing);
	const percent = Math.round((completed.length / tasks.length) * 100) || 0;
	const progress = Math.round((inProgress.length / tasks.length) * 100) || 0;

	return (
		<ProjectCardStyled to={`/project/${project.projectId}`}>
			<ProjectCardTitle>
				<div>
					<HStack>
						<h3>{project.name}</h3>
						<div style={{ marginTop: -16 }}>
							{project.endDate && <ProjectTimeStatus project={project} />}
						</div>
					</HStack>
				</div>
				<ProjectCardActions>
					<ProjectCardProperty
						onClick={(event) => {
							event.preventDefault();
							setModalContext({ propertyToProject: { properties } });
						}}
					>
						<PropertyIcon size={22} color={Theme.colors.darkLightBlue} />
					</ProjectCardProperty>
					<ProjectCardEdit
						onClick={(event) => {
							event.preventDefault();
							setModalContext({ resourceTracker: { project } });
						}}
					>
						<ToolsIcon size={22} color={Theme.colors.darkLightBlue} />
					</ProjectCardEdit>
					<ProjectCardEdit
						onClick={(event) => {
							event.preventDefault();
							setModalContext({ modifyProject: { project } });
						}}
					>
						<Edit size={20} color={Theme.colors.darkLightBlue} />
					</ProjectCardEdit>
				</ProjectCardActions>
			</ProjectCardTitle>
			<div>
				<p style={{ marginBottom: -16, fontSize: 14 }}>{project.description}</p>
				<ProgressBar percent={percent} secondaryProgress={progress} />
			</div>
		</ProjectCardStyled>
	);
});
