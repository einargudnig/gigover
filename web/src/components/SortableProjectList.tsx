import React, { useCallback, useState } from 'react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { Project } from '../models/Project';
import { ProjectCard } from './ProjectCard';
import { LexoRank } from 'lexorank';
import { projectSorter } from '../queries/useProjectList';
import { useModifyProject } from '../mutations/useModifyProject';

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
					lexoRank: lexoRank
				});
			} catch (e) {
				console.error(e);
				alert('Could not update project ordering, please try again');
			}
		},
		[mutateProject]
	);

	const updateState = useCallback(
		(sourceIndex: number, destinationIndex: number, newRank: LexoRank) => {
			const item = projects[sourceIndex];
			const newItem = {
				...item,
				lexoRank: newRank.toString()
			};

			const newProjects: Project[] = [
				...projects.filter((p) => p.projectId !== item.projectId),
				newItem
			].sort(projectSorter);

			updateLexoRank(newItem, newRank.toString()).then();
			setProjects(newProjects);
		},
		[projects, updateLexoRank]
	);

	const reorderList = useCallback(
		(sourceIndex: number, destinationIndex: number) => {
			if (projects.length === 0) {
				return;
			}

			const firstItem = projects[0];
			const firstItemLexo = firstItem.lexoRank
				? LexoRank.parse(firstItem.lexoRank)
				: LexoRank.min();

			const lastItem = projects[projects.length - 1];
			const lastItemLexo = lastItem.lexoRank
				? LexoRank.parse(lastItem.lexoRank)
				: LexoRank.max();

			const currentItem = projects[sourceIndex];
			console.log(currentItem.name);

			const currentLexoRank = currentItem.lexoRank
				? LexoRank.parse(currentItem.lexoRank)
				: LexoRank.middle();

			const prevItem = projects[destinationIndex - 1];
			const prevLexoRank =
				prevItem && prevItem.lexoRank
					? LexoRank.parse(prevItem.lexoRank)
					: currentLexoRank.genPrev();

			const nextItem = projects[destinationIndex + 1];
			const nextLexoRank =
				nextItem && nextItem.lexoRank
					? LexoRank.parse(nextItem.lexoRank)
					: currentLexoRank.genNext();

			let lexo: LexoRank;

			if (!nextItem) {
				// Moving to the bottom
				lexo = lastItemLexo.genNext();
			} else if (!prevItem) {
				// Top of the list
				lexo = firstItemLexo.genPrev();
			} else {
				lexo =
					sourceIndex > destinationIndex
						? prevLexoRank.genNext()
						: nextLexoRank.genPrev();
			}

			updateState(sourceIndex, destinationIndex, lexo);
		},
		[projects, updateState]
	);

	return (
		<ListManager
			items={projects}
			direction="vertical"
			render={(item) => <ProjectCard key={item.projectId} project={item} />}
			onDragEnd={reorderList}
		/>
	);
};
