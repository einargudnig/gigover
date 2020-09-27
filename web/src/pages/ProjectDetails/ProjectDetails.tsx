import React from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { TaskStatus } from '../../models/Task';
import { TaskColumn } from './TaskColumn';

const FeedBoard = styled.div`
	display: flex;
	flex-direction: row;
`;

const KanbanBoard = styled.div`
	flex: 1;
	user-select: none;
`;

const FeedColumn = styled.div`
	background: #fff;
	border-radius: 6px;
	padding: ${(props): string => props.theme.padding(3)};
	margin: ${(props): string => props.theme.padding(3)}
		${(props): string => props.theme.padding(1.5)};
	height: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;

	h3 {
		margin: 0 0 ${(props): string => props.theme.padding(2)};
		padding-bottom: ${(props): string => props.theme.padding(2)};
		border-bottom: 1px solid #eee;
	}
	&:not(:last-child) {
		margin-right: ${(props): string => props.theme.padding(2)};
	}
	> div {
		flex: 1;
		border-radius: 3px;
	}
`;

const ProjectDetailsPage = styled.div`
	max-width: 100%;
	height: 100%;
	flex: 1;
	overflow-x: auto;
`;

export const ProjectDetails = (): JSX.Element | null => {
	const { projectId } = useParams();
	const { data, isLoading, isError, error } = useProjectDetails(parseInt(projectId));
	const project = data && data.project;

	if (!project) {
		return null;
	}

	return (
		<Page breadcrumbs={[project.name, 'Tasks']}>
			<ProjectDetailsPage>
				{isLoading ? (
					<p>Loading</p>
				) : isError ? (
					<p>
						Error fetching project with id: {projectId} - Reason: {error?.errorText}.
						Code: {error?.errorCode}
					</p>
				) : (
					<KanbanBoard>
						<FeedBoard>
							{Object.values(TaskStatus).map((taskStatus, tIndex) => (
								<FeedColumn key={tIndex}>
									<TaskColumn project={project} status={taskStatus} />
								</FeedColumn>
							))}
						</FeedBoard>
					</KanbanBoard>
				)}
			</ProjectDetailsPage>
		</Page>
	);
};
