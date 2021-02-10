import React, { useState } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { TaskStatus, TaskStatusType } from '../../models/Task';
import { TaskColumn } from './TaskColumn';
import { CardBase } from '../../components/CardBase';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useUpdateTask } from '../../queries/useUpdateTask';
import { ManageProjectWorkers } from '../../components/modals/ManageProjectWorkers';
import { Button } from '../../components/forms/Button';

const FeedBoard = styled.div`
	display: flex;
	flex-direction: row;
	margin-left: -8px;
	margin-right: -8px;
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
	padding: 16px;

	h3 {
		margin: 0 0 ${(props): string => props.theme.padding(1)};
		padding-bottom: ${(props): string => props.theme.padding(1)};
		font-size: 16px;
	}
	&:not(:last-child) {
		margin-right: ${(props): string => props.theme.padding(2)};
	}
	> div {
		flex: 1;
		border-radius: 3px;
	}
	
	@media screen and (max-width: 1024px) {
		margin: ${(props): string => props.theme.padding(2)}
		${(props): string => props.theme.padding(1)};
		padding: 12px;
		
		&:not(:last-child) {
			margin-right: ${(props): string => props.theme.padding(1)};
		}
	}
`;

const ProjectDashboard = styled(CardBase)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	
	> div:first-child {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;

		> div {
			text-align: center;
		}

		.separator {
			margin: 0 24px;
			height: 100px;
			width: 1px;
			background-color: ${(props) => props.theme.colors.border};
			
			@media screen and (max-width: 640px) {
				margin: 0 12px;
				height: 60px;
			}
		}
	}

	h3 {
		font-weight: 300;
		font-size: 1rem;
		
		@media screen and (max-width: 760px) {
			font-size: 0.8rem;
		}
	}

	h1 {
		@media screen and (max-width: 760px) {
			font-size: 1.2rem;
		}
	}
	
	@media screen and (max-width: 640px) {
		
		h3 {
			font-size: 0.6rem;
		}
		
		h1 {
			font-size: 1.0rem;
		}
		
		> div:nth-child(2) {
			width: 100%;
			
			button {
				width: 100%;
			}
		}
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
	const [manageWorkers, setManageWorkers] = useState(false);
	const [updateTask] = useUpdateTask(projectIdNumber);
	const project = data && data.project;

	const all = project?.tasks.filter((task) => task.status !== TaskStatus.Archived).length || 0;
	const doing = project?.tasks.filter((task) => task.status === TaskStatus.Doing).length || 0;
	const doingPercent = (doing / all) * 100;
	const completed = project?.tasks.filter((task) => task.status === TaskStatus.Done).length || 0;
	const completedPercent = (completed / all) * 100;

	const onDragEnd = async (result: DropResult) => {
		const status: TaskStatusType = parseInt(
			result.destination?.droppableId || '0'
		) as TaskStatusType;
		const taskId = parseInt(result.draggableId || '0');
		const task = project?.tasks.find((t) => t.taskId === taskId);

		if (taskId === 0 || !task) {
			return;
		}

		const priority = result.destination ? result.destination.index : result.source.index;

		await updateTask({
			comment: '',
			text: task.text,
			typeId: task.typeId,
			priority,
			status,
			taskId
		});
	};

	if (!project) {
		return null;
	}

	return (
		<>
			{manageWorkers && (
				<ManageProjectWorkers onClose={() => setManageWorkers(false)} project={project} />
			)}
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
							<h3>In progress</h3>
							<h1>{(isNaN(doingPercent) ? 0 : doingPercent).toFixed(0) ?? 0}%</h1>
						</div>
						<div className={'separator'} />
						<div>
							<h3>Finished</h3>
							<h1>
								{(isNaN(completedPercent) ? 0 : completedPercent).toFixed(0) ?? 0}%
							</h1>
						</div>
					</div>
					<div>
						<Button onClick={() => setManageWorkers(true)}>Manage workers</Button>
					</div>
				</ProjectDashboard>
				<ProjectDetailsPage>
					{isLoading ? (
						<p>Loading</p>
					) : isError ? (
						<p>
							Error fetching project with id: {projectId} - Reason: {error?.errorText}
							. Code: {error?.errorCode}
						</p>
					) : (
						<KanbanBoard>
							<DragDropContext onDragEnd={onDragEnd} onDragStart={() => null}>
								<FeedBoard>
									{Object.values(TaskStatus)
										.filter((status) => status !== TaskStatus.Archived)
										.map((taskStatus, tIndex) => (
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
		</>
	);
};
