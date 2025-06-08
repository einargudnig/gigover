import { useMemo } from 'react';
import { ProgressStatus } from '../../../models/ProgressStatus';
import { Project, ProjectStatus } from '../../../models/Project';

export const useFilterProjectsBy = (
	activeTab: string | ProgressStatus,
	projects: Project[] | undefined,
	isPending: boolean
) => {
	return useMemo(() => {
		if (isPending || !projects) return [];

		return projects.filter((project) => {
			if (activeTab === ProjectStatus.ALL) return true;
			if (activeTab === ProjectStatus.OPEN) return project.status === ProjectStatus.OPEN;
			if (activeTab === ProjectStatus.CLOSED) return project.status === ProjectStatus.CLOSED;

			// Handle ProgressStatus objects
			if (typeof activeTab === 'object' && 'id' in activeTab) {
				return project.progressStatus?.id === activeTab.id;
			}

			return project.status === activeTab;
		});
	}, [activeTab, projects, isPending]);
};
