import { Button } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { ManageProjectWorkers } from '../../components/modals/ManageProjectWorkers';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { useUpdateTask } from '../../queries/useUpdateTask';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
import { TaskColumn } from './TaskColumn';

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
	const [manageWorkers, setManageWorkers] = useState(false);
	const { mutate: updateTask } = useUpdateTask(projectIdNumber);

	const { data, isLoading, isError, error } = useProjectDetails(projectIdNumber);
	const project: Project | undefined = data && data.project;

	const taskSorter = (a, b) => {
		if (a.lexoRank && b.lexoRank) {
			return a.lexoRank > b.lexoRank ? 1 : -1;
		}
		if (a.lexoRank) {
			return 1;
		}
		if (b.lexoRank) {
			return -1;
		}
		return a.primary > b.priority ? 1 : -1;
	};
	const tasks = useMemo(() => {
		return {
			[TaskStatus.Backlog]:
				project?.tasks
					.filter((task) => task.status === TaskStatus.Backlog)
					.sort(taskSorter) ?? [],
			[TaskStatus.Todo]:
				project?.tasks.filter((task) => task.status === TaskStatus.Todo).sort(taskSorter) ??
				[],
			[TaskStatus.Doing]:
				project?.tasks
					.filter((task) => task.status === TaskStatus.Doing)
					.sort(taskSorter) ?? [],
			[TaskStatus.Done]:
				project?.tasks.filter((task) => task.status === TaskStatus.Done).sort(taskSorter) ??
				[]
		};
	}, [project?.tasks]);

	const onDragEnd = async (result: DropResult) => {
		//Sort it baby
		const nextStatus = result.destination?.droppableId ?? 0;
		const nextIndex = result.destination?.index ?? 0;

		const nextRow: Task[] = tasks[nextStatus];
		const nextRank = GetNextLexoRank(nextRow, result.source.index ?? -1, nextIndex);

		const taskId = parseInt(result.draggableId || '0');

		const status: TaskStatusType = parseInt(
			result.destination?.droppableId || '0'
		) as TaskStatusType;

		const task = project?.tasks.find((t) => t.taskId === taskId);

		if (taskId === 0 || !task) {
			return;
		}

		// USE LEXO RANK INSTEAD
		const priority = result.destination ? result.destination.index : result.source.index;
		// console.log('Priority', priority);

		updateTask({
			...task,
			priority,
			lexoRank: nextRank.toString(),
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
					!isLoading &&
					project && (
						<>
							{project.owner && (
								<Button colorScheme={'gray'} onClick={() => setManageWorkers(true)}>
									Team members
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
						</>
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
													tasks={tasks[taskStatus]}
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
