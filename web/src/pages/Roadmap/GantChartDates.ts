import { DateTime, Duration, DurationLikeObject } from 'luxon';
import { CalendarType } from './hooks/useGantChart';

export const GANT_CHART_FORMAT = 'yyyy-MM-dd';

export interface DateSegment {
	dateTime: DateTime;
	title: string;
	subtitle: string;
	column: number;
}

export class GantChartDates {
	private _startDate: Date = new Date();
	private _endDate: Date = new Date();
	private _startDateTime?: DateTime;
	private _endDateTime?: DateTime;

	segments: number;
	type: CalendarType;
	initDate: Date;
	dates: Map<string, DateSegment> = new Map<string, DateSegment>();

	constructor(initDate: Date, segments: number, type: CalendarType) {
		this.initDate = initDate;
		this.segments = segments;
		this.type = type;

		this.generateDates();
	}

	getTitle = (dt: DateTime) => {
		switch (this.type) {
			case 'Days': {
				return dt.toFormat('d');
			}
			case 'Weeks': {
				return dt.toFormat('W');
			}
			case 'Months': {
				return dt.toFormat('MMM');
			}
			default:
				throw new Error(`Invalid type '${this.type}' in useGantChart.getTitle`);
		}
	};

	getSubtitle = (dt: DateTime) => {
		switch (this.type) {
			case 'Days': {
				return dt.toFormat('ccc');
			}
			case 'Weeks': {
				return dt.toFormat('MMM');
			}
			case 'Months': {
				return dt.toFormat('yyyy');
			}
			default:
				throw new Error(`Invalid type '${this.type}' in useGantChart.getTitle`);
		}
	};

	generateDates() {
		const mid = Math.ceil(this.segments / 2);
		const durationAddition: DurationLikeObject = {};
		if (this.type === 'Days') {
			durationAddition.days = 1;
		}
		if (this.type === 'Weeks') {
			durationAddition.weeks = 1;
		}
		if (this.type === 'Months') {
			durationAddition.months = 1;
		}

		const firstDate = DateTime.fromJSDate(this.initDate).minus(
			Duration.fromObject(durationAddition).mapUnits((v) => v * (this.segments - mid))
		);

		// Set start date
		this._startDateTime = firstDate;
		this._startDate = firstDate.toJSDate();

		for (let i = 0; i < this.segments; i++) {
			const dt = firstDate.plus(Duration.fromObject(durationAddition).mapUnits((v) => v * i));

			this.dates.set(dt.toFormat(GANT_CHART_FORMAT), {
				dateTime: dt,
				title: this.getTitle(dt),
				subtitle: this.getSubtitle(dt),
				column: i + 1
			});

			if (i + 1 === this.segments) {
				// Set end date
				this._endDateTime = dt;
				this._endDate = dt.toJSDate();
			}
		}
	}

	get startDate(): Date {
		return this._startDate;
	}

	get endDate(): Date {
		return this._endDate;
	}

	weekColumn(date: DateTime): number {
		let col = 0;
		this.dates.forEach((value) => {
			if (date.hasSame(value.dateTime, 'week')) {
				col = value.column;
				return;
			}
		});

		return col;
	}

	monthColumn(date: DateTime): number {
		let col = 0;
		this.dates.forEach((value) => {
			if (date.hasSame(value.dateTime, 'month')) {
				// eslint-disable-next-line no-console
				console.log('Date', date, 'is in same month as ', value.dateTime);
				col = value.column;
				return;
			}
		});

		return col;
	}
}
