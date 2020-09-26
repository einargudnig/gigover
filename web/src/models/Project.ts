import { Task } from './Task';

export const ProjectStatus = {
	CLOSED: 'CLOSED'
} as const;

export interface Project {
	description: string;
	name: string;
	projectId: number;
	status: typeof ProjectStatus | number;
	tasks: Task[];
	length: number;
	zipCode: string;
}
