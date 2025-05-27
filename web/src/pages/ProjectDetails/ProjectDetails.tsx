import { Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Project } from '../../models/Project';
import { Task, TaskStatus, TaskStatusType } from '../../models/Task';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { useUpdateTask } from '../../queries/useUpdateTask';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
import { TaskColumn } from './TaskColumn';

export const ProjectDetails = (): JSX.Element | null => {
	const { projectId } = useParams();
	const projectIdNumber = parseInt(projectId as string);
	const { mutate: updateTask } = useUpdateTask(projectIdNumber);

	const { data, isPending: isLoading, isError, error } = useProjectDetails(projectIdNumber);
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
			<Box>
				{isLoading ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : isError ? (
					<p>
						Error fetching project with id: {projectId} - Reason: {error?.errorText}.
						Code: {error?.errorCode}
					</p>
				) : (
					<Box flex={1} userSelect="none">
						<DragDropContext onDragEnd={onDragEnd} onDragStart={() => null}>
							<Flex flexDirection="row" marginLeft="-8px" marginRight="-8px">
								{Object.values(TaskStatus)
									.filter((status) => status !== TaskStatus.Archived)
									.map((taskStatus, tIndex) => (
										<Box
											key={tIndex}
											marginX={{ base: 1, md: 1.5 }}
											height="100%"
											flex={1}
											display="flex"
											flexDirection="column"
											padding={{ base: '12px', md: '16px' }}
											sx={{
												'> div': {
													flex: 1,
													borderRadius: '3px'
												},
												'@media screen and (max-width: 1024px)': {
													'&:not(:last-child)': {
														marginRight: 1
													}
												}
											}}
										>
											<TaskColumn
												project={project!}
												status={taskStatus}
												tasks={tasks[taskStatus]}
											/>
										</Box>
									))}
							</Flex>
						</DragDropContext>
					</Box>
				)}
			</Box>
		</>
	);
};
