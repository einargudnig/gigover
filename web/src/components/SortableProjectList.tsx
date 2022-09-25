import React, { useCallback, useState } from 'react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { Project } from '../models/Project';
import { ProjectCard } from './ProjectCard';
import { LexoRank } from 'lexorank';
import { projectSorter } from '../queries/useProjectList';
import { useModifyProject } from '../mutations/useModifyProject';
import { GetNextLexoRank } from '../utils/GetNextLexoRank';

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

			const nextRank = GetNextLexoRank(projects, sourceIndex, destinationIndex);
			updateState(sourceIndex, destinationIndex, nextRank);
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
