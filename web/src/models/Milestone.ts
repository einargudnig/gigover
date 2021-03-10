import { GANT_CHART_FORMAT, GantChartDates } from '../pages/Roadmap/GantChartDates';
import moment from 'moment';

export class Milestone {
	title: string;
	description: string;
	estimatedHours: number;
	startDate: number; // Timestamp
	endDate: number; // Timestamp
	projectId: number;

	constructor(
		title: string,
		description: string,
		estimatedHours: number,
		startDate: number,
		endDate: number,
		projectId: number
	) {
		this.title = title;
		this.description = description;
		this.estimatedHours = estimatedHours;
		this.startDate = startDate;
		this.endDate = endDate;
		this.projectId = projectId;
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
		// eslint-disable-next-line no-console
		console.log(moment(start).format('YYYY-MM-DD'), 'start');
		// eslint-disable-next-line no-console
		console.log(moment(this.startDate).format('YYYY-MM-DD'), 'start');

		return this.startDate < start.getTime();
	}

	private isAfterEnd(end: Date) {
		// eslint-disable-next-line no-console
		console.log(end.getMonth(), end.getDay(), 'end');
		// eslint-disable-next-line no-console
		console.log(moment(this.endDate).format('MM-DD'), 'end');
		return this.endDate > end.getTime();
	}

	/**
	 * Get the column position for the milestone
	 *
	 * If false: It should not show within the current view.
	 * @param gcd
	 */
	getColPositions(gcd: GantChartDates): [number, number] | false {
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
}
