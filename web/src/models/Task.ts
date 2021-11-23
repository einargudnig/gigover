import { TaskComment } from './TaskComment';
import { GantChartItem } from './GantChartItem';
import { ProjectImage } from "./ProjectImage";

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
	startDate: number | null;
	endDate: number | null;
	images: ProjectImage[];
}

export class TaskItem extends GantChartItem implements Task {
	taskId: number;
	projectId: number;
	typeId: number;
	text: string;
	status: TaskStatusType;
	minutes: number; // Minutes tracked
	comments: TaskComment[];
	priority: number;
	images: ProjectImage[];

	constructor(task: Task) {
		super(task.startDate, task.endDate);
		this.taskId = task.taskId;
		this.projectId = task.projectId;
		this.typeId = task.typeId;
		this.text = task.text;
		this.status = task.status;
		this.minutes = task.minutes;
		this.comments = task.comments;
		this.priority = task.priority;
		this.images = task.images;
	}

	get taskJson(): Task {
		return {
			taskId: this.taskId,
			projectId: this.projectId,
			typeId: this.typeId,
			text: this.text,
			status: this.status,
			minutes: this.minutes,
			comments: this.comments,
			priority: this.priority,
			startDate: this.startDate,
			endDate: this.endDate,
			images: this.images
		};
	}
}
