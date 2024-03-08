import React, { useCallback, useState } from 'react';
import { Project } from '../models/Project';
import { ProjectCard } from './ProjectCard';
// import { LexoRank } from 'lexorank';
import { projectSorter } from '../queries/useProjectList';
import { useModifyProject } from '../mutations/useModifyProject';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

	const updateLexoRank = useCallback(
		async (project: Project, lexoRank: string) => {
			try {
				console.log(
					'Updating lexoRank for Project: ',
					project.projectId,
					' to: ',
					lexoRank
				);
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
			console.log('updating state!!');
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

	console.log('SortableProjectList: ', projects);
	return (
		<DragDropContext onDragEnd={updateState}>
			<Droppable droppableId="project-list">
				{(droppable, snapshot) => (
					<div
						{...droppable.droppableProps}
						ref={droppable.innerRef}
						style={getListStyle(snapshot.isDraggingOver)}
					>
						{projects.map((project, projectIndex) => {
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
