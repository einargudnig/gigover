import { Box, Button, Flex, HStack, IconButton, Spacer, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { NavLink, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Page } from '../../components/Page';
import { FilterIcon } from '../../components/icons/FilterIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';
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

export const ProjectDetails = (): JSX.Element | null => {
	const { projectId } = useParams();
	const projectIdNumber = parseInt(projectId as string);
	const [manageWorkers, setManageWorkers] = useState(false);
	const { mutate: updateTask } = useUpdateTask(projectIdNumber);
	const [showSearch, setShowSearch] = useState(false);

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
					...(isLoading ? [] : [{ title: project?.name || '' }])
				]}
				actions={
					!isLoading &&
					project && (
						<>
							{project.owner && (
								<Button
									colorScheme={'yellow'}
									onClick={() => setManageWorkers(true)}
								>
									Add members
								</Button>
							)}
						</>
					)
				}
				extraNav={
					<Flex
						borderBottom={'1px'}
						backgroundColor={'white'}
						borderColor={'gray.400'}
						alignItems={'center'}
						px={3}
						py={1}
					>
						<Box>
							<HStack>
								<NavLink to={`/project/${projectId}`}>
									{({ isActive }) => (
										<Box as="button" borderBottom={isActive ? '1px' : 'hidden	'}>
											Board
										</Box>
									)}
								</NavLink>
								<NavLink to={`/roadmap?project=${projectId}`}>Gantt</NavLink>
								<NavLink to={`/files/${projectId}`}>Files</NavLink>
							</HStack>
						</Box>
						<Spacer />
						<Box>
							{showSearch ? (
								// <SearchBar />
								<Text>Test</Text>
							) : (
								<IconButton
									variant={'outline'}
									aria-label={'Search'}
									colorScheme={'gray'}
									icon={<SearchIcon color={'black'} />}
									onClick={() => setShowSearch((v) => !v)}
								/>
							)}
							<IconButton
								variant={'outline'}
								colorScheme={'gray'}
								aria-label={'Filter'}
								icon={<FilterIcon color={'black'} />}
								marginLeft={3}
							/>
						</Box>
					</Flex>
				}
			>
				<Box maxWidth="100%" height="100%" flex="1" overflowX="auto">
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
				</Box>
			</Page>
		</>
	);
};
