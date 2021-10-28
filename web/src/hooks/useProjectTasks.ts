import { useMemo } from 'react';
import { Project } from '../models/Project';

export const useProjectTasks = (currentProject?: Project | null) =>
	useMemo(() => {
		if (currentProject) {
			return currentProject ? currentProject.tasks : [];
		} else {
			return [];
		}
	}, [currentProject]);
