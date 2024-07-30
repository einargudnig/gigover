import React, { useCallback, useState } from 'react';
import { Project } from '../models/Project';
// import { LexoRank } from 'lexorank';
import { Box, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { TaskStatus } from '../models/Task';
import { useModifyProject } from '../mutations/useModifyProject';
import { useGetProperties } from '../queries/properties/useGetPoperties';
import { projectSorter } from '../queries/useProjectList';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';
import { VerticalDots } from './icons/VerticalDots';

interface SortableGridProps {
	list: Project[];
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
	minHeight: 140,
	background: !isDraggingOver ? 'transparent' : '#e7fff3'
});

export const NewProjectOverview = ({ list }: SortableGridProps) => {
	const mutateProject = useModifyProject();
	const [projects, setProjects] = useState(list);
	// console.log({ projects });

	const updateLexoRank = useCallback(
		async (project: Project, lexoRank: string) => {
			try {
				console.log(
					'Updating lexoRank for Project: ',
					project.projectId,
					' to: ',
					lexoRank
				);
				const rank = await mutateProject.mutateAsync({
					projectId: project.projectId,
					name: project.name,
					description: project.description,
					startDate: project.startDate,
					endDate: project.endDate,
					status: project.status,
					progressStatus: project.progressStatus,
					lexoRank: lexoRank
				});
				console.log('Updated lexoRank: ', rank);
			} catch (e) {
				console.error(e);
				alert('Could not update project ordering, please try again');
			}
		},
		[mutateProject]
	);

	// const updateState = useCallback(
	// 	(sourceIndex: number, destinationIndex: number, newRank: LexoRank) => {
	// 		const item = projects[sourceIndex];
	// 		const newItem = {
	// 			...item,
	// 			lexoRank: newRank.toString()
	// 		};

	// 		const newProjects: Project[] = [
	// 			...projects.filter((p) => p.projectId !== item.projectId),
	// 			newItem
	// 		].sort(projectSorter);

	// 		updateLexoRank(newItem, newRank.toString()).then();
	// 		setProjects(newProjects);
	// 	},
	// 	[projects, updateLexoRank]
	// );

	// const reorderList = useCallback(
	// 	(sourceIndex: number, destinationIndex: number) => {
	// 		if (projects.length === 0) {
	// 			return;
	// 		}

	// 		const nextRank = GetNextLexoRank(projects, sourceIndex, destinationIndex);
	// 		updateState(sourceIndex, destinationIndex, nextRank);
	// 	},
	// 	[projects, updateState]
	// );

	const updateState = useCallback(
		(result: DropResult) => {
			console.log('updating state!!');
			const { source, destination } = result;
			if (!destination) {
				return;
			}

			const sourceIndex = source.index;
			console.log('sourceIndex', sourceIndex);
			const destinationIndex = destination.index;
			console.log('destinationIndex', destinationIndex);

			if (sourceIndex === destinationIndex) {
				return;
			}

			const item = projects[sourceIndex];
			const nextRank = GetNextLexoRank(projects, sourceIndex, destinationIndex);
			console.log('nextRank', nextRank.toString());

			const newItem = {
				...item,
				lexoRank: nextRank.toString()
			};
			console.log('newItem', newItem);

			const newProjects: Project[] = [
				...projects.filter((p) => p.projectId !== item.projectId),
				newItem
			].sort(projectSorter);
			console.log('newProjects', newProjects);

			updateLexoRank(newItem, nextRank.toString()).then();
			setProjects(newProjects);
		},
		[projects, updateLexoRank]
	);

	// TODO made this to be sure that we are
	const sortedItems = projects.sort((a, b) => a.lexoRank.localeCompare(b.lexoRank));

	return (
		<Box>
			<DragDropContext onDragEnd={updateState}>
				<TableContainer mt={3}>
					<Table>
						<Thead>
							<Tr>
								<Th>Project name</Th>
								<Th>Due date</Th>
								<Th>Status</Th>
								<Th>Property</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody backgroundColor={'white'}>
							<Droppable droppableId="project-list">
								{(droppable, snapshot) => (
									<div
										{...droppable.droppableProps}
										ref={droppable.innerRef}
										style={getListStyle(snapshot.isDraggingOver)}
									>
										{sortedItems.map((project, projectIndex) => {
											return (
												<Draggable
													key={project.projectId.toString()}
													draggableId={project.projectId.toString()}
													index={projectIndex}
												>
													{(provided): JSX.Element => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
														>
															{/* <ProjectCard project={project} /> */}
															{/* <NewProjectCard project={project} /> */}

															<Tr>
																<Td>{project.name}</Td>
																<Td>{project.endDate}</Td>
																<Td>{project.status}</Td>
																<Td>
																	<VerticalDots />
																</Td>
															</Tr>
														</div>
													)}
												</Draggable>
											);
										})}
										{droppable.placeholder}
									</div>
								)}
							</Droppable>
						</Tbody>
					</Table>
				</TableContainer>
			</DragDropContext>
		</Box>
	);
};

const NewProjectCard = ({ project }) => {
	const { data: properties } = useGetProperties();
	const projectId = project.projectId; // for the propertyToProjectModal
	const tasks = project.tasks.filter((task) => task.status !== TaskStatus.Archived) || [];
	const completed = tasks.filter((task) => task.status === TaskStatus.Done);
	const inProgress = tasks.filter((task) => task.status === TaskStatus.Doing);
	const percent = Math.round((completed.length / tasks.length) * 100) || 0;
	const progress = Math.round((inProgress.length / tasks.length) * 100) || 0;

	return (
		<Box>
			<Tbody>
				<Tr>
					<Td>{project.name}</Td>
					<Td>{project.endDate}</Td>
					<Td>{project.status}</Td>
				</Tr>
			</Tbody>
		</Box>
	);
};
