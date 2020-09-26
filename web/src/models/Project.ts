import { Task } from './Task';
import { TaskComment } from './TaskComment';

export const ProjectStatus = {
	CLOSED: 'CLOSED',
	OPEN: 'OPEN',
	ARCHIVED: 'ARCHIVED'
} as const;

export interface Project {
	description: string;
	name: string;
	projectId: number;
	status: typeof ProjectStatus | number;
	tasks?: Task[];
	length: number;
	zipCode: string;
	uId: string;
	comments?: TaskComment[];
}
