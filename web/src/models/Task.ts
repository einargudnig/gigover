import { Project } from './Project';
import { TaskComment } from './TaskComment';

export const TaskStatus = {
	Backlog: 0,
	Todo: 1,
	Doing: 2,
	Done: 3
} as const;

export const TaskStatusArray: string[] = Object.keys(TaskStatus);

export interface Task {
	taskId: number;
	project: Project;
	text: string;
	status: typeof TaskStatus;
	typeId: number;
	minutes: number; // Minutes tracked
	comments: TaskComment[];
}
