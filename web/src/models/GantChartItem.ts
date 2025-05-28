import { DateTime } from 'luxon';
import { DateSegment, GANT_CHART_FORMAT, GantChartDates } from '../pages/Roadmap/GantChartDates';
import { CalendarType } from '../pages/Roadmap/hooks/useGantChart';

type NullableTimestamp = number | null;

export class GantChartItem {
	public startDate: NullableTimestamp;
	public endDate: NullableTimestamp;

	constructor(startDate: NullableTimestamp, endDate: NullableTimestamp) {
		this.startDate = startDate;
		this.endDate = endDate;
	}

	/**
	 * Used to determine if the milestone should not be shown
	 * @param start
	 * @param end
	 * @private
	 */
	private isOutsideOfScope(start: Date, end: Date) {
		return this.startDate! > end.getTime() || this.endDate! < start.getTime();
	}

	/**
	 * Used to determine if the milestone should show
	 * within the Gant Chart
	 * @param start
	 * @param end
	 */
	private isInDateRange(start: Date, end: Date): boolean {
		return this.startDate! > start.getTime() && this.endDate! < end.getTime();
	}

	private isBeforeStart(start: Date) {
		return this.startDate! < start.getTime();
	}

	private isAfterEnd(end: Date) {
		return this.endDate! > end.getTime();
	}

	/**
	 * Get the column position for the milestone
	 *
	 * If false: It should not show within the current view.
	 * @param gcd GantChartDates
	 * @param type CalendarType
	 */
	getColPositions(gcd: GantChartDates, type: CalendarType): [number, number] | false {
		const dates = gcd.dates;
		const start = gcd.startDate;
		const end = gcd.endDate;

		if (this.startDate === null || this.endDate === null) {
			return false;
		}

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
		const startIndex =
			dates.get(DateTime.fromMillis(this.startDate!).toFormat(GANT_CHART_FORMAT))?.column ||
			0;
		const endIndex =
			dates.get(DateTime.fromMillis(this.endDate!).toFormat(GANT_CHART_FORMAT))?.column || 0;

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
		const startIndex = gcd.monthColumn(DateTime.fromMillis(this.startDate!));
		const endIndex = gcd.monthColumn(DateTime.fromMillis(this.endDate!));
		return this.getWeekAndColPositions(gcd.dates.size, startIndex, endIndex);
	}

	getWeekColPositions(gcd: GantChartDates): [number, number] | false {
		const startIndex = gcd.weekColumn(DateTime.fromMillis(this.startDate!));
		const endIndex = gcd.weekColumn(DateTime.fromMillis(this.endDate!));
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
