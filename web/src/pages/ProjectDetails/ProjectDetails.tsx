import React, { useState } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { Link, useParams } from 'react-router-dom';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { TaskStatus, TaskStatusType } from '../../models/Task';
import { TaskColumn } from './TaskColumn';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useUpdateTask } from '../../queries/useUpdateTask';
import { ManageProjectWorkers } from '../../components/modals/ManageProjectWorkers';
import { Button, HStack } from '@chakra-ui/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Project } from '../../models/Project';

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

const FeedColumn = styled.div`
	margin: 0 ${(props): string => props.theme.padding(1.5)};
	height: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 16px;

	> div {
		flex: 1;
		border-radius: 3px;
	}

	@media screen and (max-width: 1024px) {
		margin: 0 ${(props): string => props.theme.padding(1)};
		padding: 12px;

		&:not(:last-child) {
			margin-right: ${(props): string => props.theme.padding(1)};
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
	const projectIdNumber = parseInt(projectId as string);
	const { data, isLoading, isError, error } = useProjectDetails(projectIdNumber);
	const [manageWorkers, setManageWorkers] = useState(false);
	const { mutate: updateTask } = useUpdateTask(projectIdNumber);
	const project: Project | undefined = data && data.project;

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

	if (!isLoading && !project) {
		throw new Error('Could not find project');
	}

	return (
		<>
			{manageWorkers && project && (
				<ManageProjectWorkers onClose={() => setManageWorkers(false)} project={project} />
			)}
			<Page
				breadcrumbs={[
					{ title: 'Projects', url: '/' },
					...(isLoading ? [] : [{ title: project?.name || '' }, { title: 'Tasks' }])
				]}
				actions={
					project && (
						<HStack spacing={4}>
							{project.owner && (
								<Button colorScheme={'gray'} onClick={() => setManageWorkers(true)}>
									Add team members
								</Button>
							)}
							<Button
								colorScheme={'gray'}
								as={Link}
								to={'/roadmap?project=' + project.projectId}
							>
								Gantt Chart
							</Button>
							<Button
								colorScheme={'gray'}
								as={Link}
								to={'/files/' + project.projectId}
							>
								Project Files
							</Button>
						</HStack>
					)
				}
			>
				<ProjectDetailsPage>
					{isLoading ? (
						<LoadingSpinner />
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
												<TaskColumn
													project={project!}
													status={taskStatus}
												/>
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
