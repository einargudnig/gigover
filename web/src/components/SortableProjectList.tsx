import React, { useCallback, useState } from 'react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { Project } from '../models/Project';
import { ProjectCard } from './ProjectCard';
import { LexoRank } from 'lexorank';
import { projectSorter } from '../queries/useProjectList';
import { useModifyProject } from '../mutations/useModifyProject';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface SortableGridProps {
	list: Project[];
}

export const SortableProjectList = ({ list }: SortableGridProps) => {
	const mutateProject = useModifyProject();
	const [projects, setProjects] = useState(list);

	const updateLexoRank = useCallback(
		async (project: Project, lexoRank: string) => {
			try {
				await mutateProject.mutateAsync({
					projectId: project.projectId,
					name: project.name,
					description: project.description,
					startDate: project.startDate,
					endDate: project.endDate,
					status: project.status,
					progressStatus: project.progressStatus,
					lexoRank: lexoRank
				});
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
			const { source, destination } = result;
			if (!destination) {
				return;
			}

			const sourceIndex = source.index;
			const destinationIndex = destination.index;

			if (sourceIndex === destinationIndex) {
				return;
			}

			const item = projects[sourceIndex];
			const nextRank = GetNextLexoRank(projects, sourceIndex, destinationIndex);

			const newItem = {
				...item,
				lexoRank: nextRank.toString()
			};

			const newProjects: Project[] = [
				...projects.filter((p) => p.projectId !== item.projectId),
				newItem
			].sort(projectSorter);

			updateLexoRank(newItem, nextRank.toString()).then();
			setProjects(newProjects);
		},
		[projects, updateLexoRank]
	);

	return (
		<DragDropContext onDragEnd={updateState}>
			<Droppable droppableId="project-list">
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{projects.map((project, index) => {
							return (
								<Draggable
									key={project.projectId}
									draggableId={project.projectId.toString()}
									index={index}
								>
									{
										// eslint-disable-next-line
										(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<ProjectCard project={project} />
											</div>
										)
									}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};
