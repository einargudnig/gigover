import React, { useCallback, useState } from 'react';
import { Project } from '../models/Project';
import { ProjectCard } from './ProjectCard';
// import { LexoRank } from 'lexorank';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { useModifyProject } from '../mutations/useModifyProject';
import { projectSorter } from '../queries/useProjectList';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';

interface SortableGridProps {
	list: Project[];
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
	minHeight: 140,
	background: !isDraggingOver ? 'transparent' : '#e7fff3'
});

export const SortableProjectList = ({ list }: SortableGridProps) => {
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
		<DragDropContext onDragEnd={updateState}>
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
											<ProjectCard project={project} />
										</div>
									)}
								</Draggable>
							);
						})}
						{droppable.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};
