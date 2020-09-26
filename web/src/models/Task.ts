import { Project } from './Project';
import { TaskComment } from './TaskComment';

const TaskStatus = {
	Backlog: 0,
	Todo: 1,
	Doing: 2,
	Done: 3
} as const;

export interface Task {
	taskId: number;
	project: Project;
	text: string;
	status: typeof TaskStatus;
	typeId: number;
	minutes: number; // Minutes tracked
	comments: TaskComment[];
}
