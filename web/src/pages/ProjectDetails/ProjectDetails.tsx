import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { TaskStatus, TaskStatusType } from '../../models/Task';
import { TaskColumn } from './TaskColumn';
import { CardBase } from '../../components/CardBase';
import { AddWorkerForm } from './AddWorkerForm';
import { DragDropContext, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useUpdateTask } from '../../queries/useUpdateTask';

const FeedBoard = styled.div`
	display: flex;
	flex-direction: row;
`;

const KanbanBoard = styled.div`
	flex: 1;
	user-select: none;
`;

const FeedColumn = styled(CardBase)`
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

const ProjectDashboard = styled(CardBase)`
	display: flex;
	justify-content: space-between;
	align-items: center;

	> div:first-child {
		display: flex;
		justify-content: space-between;
		align-items: center;

		> div {
			margin: 0 ${(props) => props.theme.padding(6)};
			text-align: center;
		}

		.separator {
			height: 100px;
			width: 1px;
			background-color: ${(props) => props.theme.colors.border};
		}
	}

	h3 {
		font-weight: 300;
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
	const projectIdNumber = parseInt(projectId);
	const { data, isLoading, isError, error } = useProjectDetails(projectIdNumber);
	const [updateTask] = useUpdateTask(projectIdNumber);
	const project = data && data.project;

	const all = project?.tasks.length || 0;
	const completed = project?.tasks.filter((task) => task.status === TaskStatus.Done).length || 0;

	const onDragEnd = async (result: DropResult) => {
		const status: TaskStatusType = parseInt(
			result.destination?.droppableId || '0'
		) as TaskStatusType;
		const taskId = parseInt(result.draggableId || '0');

		if (taskId === 0) {
			return;
		}

		await updateTask({
			comment: '',
			status,
			taskId
		});
	};

	if (!project) {
		return null;
	}

	return (
		<Page breadcrumbs={[project.name, 'Tasks']}>
			<ProjectDashboard>
				<div>
					<div>
						<h3>Task count</h3>
						<h1>{all}</h1>
					</div>
					<div className={'separator'} />
					<div>
						<h3>Completed tasks</h3>
						<h1>{completed}</h1>
					</div>
					<div className={'separator'} />
					<div>
						<h3>Finished</h3>
						<h1>{((completed / all) * 100).toFixed(0)}%</h1>
					</div>
				</div>
				<AddWorkerForm projectId={project.projectId} />
			</ProjectDashboard>
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
						<DragDropContext onDragEnd={onDragEnd} onDragStart={() => null}>
							<FeedBoard>
								{Object.values(TaskStatus).map((taskStatus, tIndex) => (
									<FeedColumn key={tIndex}>
										<TaskColumn project={project} status={taskStatus} />
									</FeedColumn>
								))}
							</FeedBoard>
						</DragDropContext>
					</KanbanBoard>
				)}
			</ProjectDetailsPage>
		</Page>
	);
};
