import { ProgressStatus } from '../../../models/ProgressStatus';
import { Project, ProjectStatus } from '../../../models/Project';
import { useMemo } from 'react';

export const useFilterProjectsBy = (
	filter: string | ProgressStatus,
	projects: Project[],
	isLoading: boolean
) => {
	return useMemo(() => {
		if (isLoading) {
			return [];
		}

		if (typeof filter === 'string') {
			return projects.filter(
				(project) =>
					project.status !== ProjectStatus.DONE &&
					(filter === ProjectStatus.ALL || project.status === filter)
			);
		}

		return projects.filter(
			(project) => project.progressStatus === (filter as ProgressStatus).name
		);
	}, [filter, projects, isLoading]);
};
