import { TaskComment } from './TaskComment';

export const TaskStatus = {
	Backlog: 0,
	Todo: 1,
	Doing: 2,
	Done: 3,
	Archived: -1
} as const;

export type TaskStatusType = 0 | 1 | 2 | 3 | -1;

export interface Task {
	taskId: number;
	projectId: number;
	typeId: number;
	text: string;
	status: TaskStatusType;
	minutes: number; // Minutes tracked
	comments: TaskComment[];
	priority: number;
}
