import { Task, TaskItem } from './Task';
import { GantChartItem } from './GantChartItem';

export interface MilestoneForm {
	milestoneId: number;
	projectId: number;
	title: string;
	description: string;
	estimatedHours: number;
	startDate: number;
	endDate: number;
	projectTasks: Task[];
}

export class Milestone extends GantChartItem implements MilestoneForm {
	milestoneId: number;
	title: string;
	description: string;
	estimatedHours: number;
	projectId: number;
	startDate: number;
	endDate: number;
	projectTasks: TaskItem[];

	constructor(
		milestoneId: number,
		title: string,
		description: string,
		estimatedHours: number,
		startDate: number,
		endDate: number,
		projectId: number,
		projectTasks: Task[]
	) {
		super(startDate, endDate);
		this.milestoneId = milestoneId;
		this.title = title;
		this.description = description;
		this.estimatedHours = estimatedHours;
		this.projectId = projectId;
		this.projectTasks = projectTasks.map((v) => new TaskItem(v));
		this.startDate = startDate;
		this.endDate = endDate;
	}

	get milestoneJson(): MilestoneForm {
		return {
			milestoneId: this.milestoneId,
			title: this.title,
			description: this.description,
			estimatedHours: this.estimatedHours,
			startDate: this.startDate,
			endDate: this.endDate,
			projectId: this.projectId,
			projectTasks: this.projectTasks.map((v) => v.taskJson)
		};
	}
}
