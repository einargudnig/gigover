import { DateSegment, GANT_CHART_FORMAT, GantChartDates } from '../pages/Roadmap/GantChartDates';
import moment from 'moment';
import { Task } from './Task';
import { CalendarType } from '../pages/Roadmap/hooks/useGantChart';

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

export class Milestone implements MilestoneForm {
	milestoneId: number;
	title: string;
	description: string;
	estimatedHours: number;
	startDate: number; // Timestamp
	endDate: number; // Timestamp
	projectId: number;
	projectTasks: Task[];

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
		this.milestoneId = milestoneId;
		this.title = title;
		this.description = description;
		this.estimatedHours = estimatedHours;
		this.startDate = startDate;
		this.endDate = endDate;
		this.projectId = projectId;
		this.projectTasks = projectTasks;
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
			projectTasks: this.projectTasks
		};
	}

	/**
	 * Used to determine if the milestone should not be shown
	 * @param start
	 * @param end
	 * @private
	 */
	private isOutsideOfScope(start: Date, end: Date) {
		return this.startDate > end.getTime() || this.endDate < start.getTime();
	}

	/**
	 * Used to determine if the milestone should show
	 * within the Gant Chart
	 * @param start
	 * @param end
	 */
	private isInDateRange(start: Date, end: Date): boolean {
		return this.startDate > start.getTime() && this.endDate < end.getTime();
	}

	private isBeforeStart(start: Date) {
		return this.startDate < start.getTime();
	}

	private isAfterEnd(end: Date) {
		return this.endDate > end.getTime();
	}

	/**
	 * Get the column position for the milestone
	 *
	 * If false: It should not show within the current view.
	 * @param gcd
	 */
	getColPositions(gcd: GantChartDates, type: CalendarType): [number, number] | false {
		const dates = gcd.dates;
		const start = gcd.startDate;
		const end = gcd.endDate;

		// Call these two first since we can skip doing date calculations
		if (this.isOutsideOfScope(start, end)) {
			return false;
		} else if (this.isBeforeStart(start) && this.isAfterEnd(end)) {
			// eslint-disable-next-line no-console
			return [1, dates.size];
		}

		switch (type) {
			case 'Days':
				return this.getDayColPositions(dates, start, end);
			case 'Months':
				return this.getMonColPositions(gcd);
			case 'Weeks':
				return this.getWeekColPositions(gcd);
			default:
				throw new Error(`Invalid CalendarType (${type}) in getColPositions`);
		}
	}

	getDayColPositions(
		dates: Map<string, DateSegment>,
		start: Date,
		end: Date
	): [number, number] | false {
		const startIndex = dates.get(moment(this.startDate).format(GANT_CHART_FORMAT))?.column || 0;
		const endIndex = dates.get(moment(this.endDate).format(GANT_CHART_FORMAT))?.column || 0;

		if (this.isInDateRange(start, end)) {
			return [startIndex, endIndex];
		} else if (this.isBeforeStart(start)) {
			return [1, endIndex];
		} else if (this.isAfterEnd(end)) {
			return [startIndex, dates.size];
		}

		return false;
	}

	getMonColPositions(gcd: GantChartDates): [number, number] | false {
		const startIndex = gcd.monthColumn(moment(this.startDate));
		const endIndex = gcd.monthColumn(moment(this.endDate));
		return this.getWeekAndColPositions(gcd.dates.size, startIndex, endIndex);
	}

	getWeekColPositions(gcd: GantChartDates): [number, number] | false {
		const startIndex = gcd.weekColumn(moment(this.startDate));
		const endIndex = gcd.weekColumn(moment(this.endDate));
		return this.getWeekAndColPositions(gcd.dates.size, startIndex, endIndex);
	}

	getWeekAndColPositions(
		dateSize: number,
		startIndex: number,
		endIndex: number
	): [number, number] | false {
		if (startIndex + endIndex === 0) {
			return false;
		}

		if (startIndex > endIndex) {
			return [startIndex, dateSize];
		} else if (startIndex === 0 && endIndex > 0) {
			return [1, endIndex];
		}

		return [startIndex, endIndex];
	}
}
