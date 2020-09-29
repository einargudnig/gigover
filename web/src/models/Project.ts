import { Task } from './Task';
import { TaskComment } from './TaskComment';

export const ProjectStatus = {
	ALL: 'ALL',
	CLOSED: 'CLOSED',
	OPEN: 'OPEN',
	DONE: 'DONE'
};

export type ProjectStatusType = 'CLOSED' | 'OPEN' | 'DONE';

export interface Project {
	description: string;
	name: string;
	projectId: number;
	status: ProjectStatusType;
	tasks: Task[];
	length: number;
	zipCode: string;
	uId: string;
	comments?: TaskComment[];
	workers: string[];
}
