import { Task } from './Task';
import { TaskComment } from './TaskComment';
import { ProjectImage } from './ProjectImage';

export const ProjectStatus = {
	ALL: 'ALL',
	CLOSED: 'CLOSED',
	OPEN: 'OPEN',
	DONE: 'DONE'
};

export type ProjectStatusType = 'CLOSED' | 'OPEN' | 'DONE';

// TODO Refactor to file
export type WorkerItem = {
	name: string;
	uId: string;
	userName: string;
	type?: number;
};

export interface Project {
	description: string;
	name: string;
	projectId: number;
	status: ProjectStatusType;
	tasks: Task[];
	length: number;
	zipCode: string;
	uId: string;
	startDate: number;
	endDate: number;
	comments?: TaskComment[];
	workers: WorkerItem[];
	images: ProjectImage[];
	totalBytes: number;
	fileCount: number;
	owner: boolean;
}
