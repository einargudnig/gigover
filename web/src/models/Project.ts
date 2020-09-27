import { Task } from './Task';
import { TaskComment } from './TaskComment';

export const ProjectStatus = {
	ALL: 'ALL',
	CLOSED: 'CLOSED',
	OPEN: 'OPEN',
	DONE: 'DONE'
} as const;

export interface Project {
	description: string;
	name: string;
	projectId: number;
	status: 'CLOSED' | 'OPEN' | 'DONE';
	tasks?: Task[];
	length: number;
	zipCode: string;
	uId: string;
	comments?: TaskComment[];
}
