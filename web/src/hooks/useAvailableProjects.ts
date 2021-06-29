import { useMemo } from 'react';
import { Project, ProjectStatus } from '../models/Project';

export const useOpenProjects = (initialProjects: Project[]): Project[] => {
	return useMemo(() => {
		return initialProjects.filter(
			(p) => p.status !== ProjectStatus.CLOSED && p.status !== ProjectStatus.DONE
		);
	}, [initialProjects]);
};
