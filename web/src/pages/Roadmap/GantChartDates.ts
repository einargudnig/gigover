import { CalendarType } from './hooks/useGantChart';
import moment, { DurationInputArg2 } from 'moment';

export const GANT_CHART_FORMAT = 'YYYY-MM-DD';

export interface DateSegment {
	moment: moment.Moment;
	title: string;
	subtitle: string;
	column: number;
}

export class GantChartDates {
	private _startDate: Date = new Date();
	private _endDate: Date = new Date();
	private _startDateMoment?: moment.Moment;
	private _endDateMoment?: moment.Moment;

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

	getTitle = (m: moment.Moment) => {
		switch (this.type) {
			case 'Days': {
				return m.format('D');
			}
			case 'Weeks': {
				return m.format('W');
			}
			case 'Months': {
				return m.format('MMM');
			}
			default:
				throw new Error(`Invalid type '${this.type}' in useGantChart.getTitle`);
		}
	};

	getSubtitle = (m: moment.Moment) => {
		switch (this.type) {
			case 'Days': {
				return m.format('ddd');
			}
			case 'Weeks': {
				return m.format('MMM');
			}
			case 'Months': {
				return m.format('YYYY');
			}
			default:
				throw new Error(`Invalid type '${this.type}' in useGantChart.getTitle`);
		}
	};

	generateDates() {
		const mid = Math.ceil(this.segments / 2);
		const durationAddition = this.type as DurationInputArg2;
		const firstDate = moment(this.initDate).add(-(this.segments - mid), durationAddition);

		// Set start date
		this._startDateMoment = firstDate;
		this._startDate = firstDate.toDate();

		for (let i = 0; i < this.segments; i++) {
			// Clone the firstDate by wrapping moment so it won't add to it.
			const m = moment(firstDate).add(i, durationAddition);

			this.dates.set(m.format(GANT_CHART_FORMAT), {
				moment: m,
				title: this.getTitle(m),
				subtitle: this.getSubtitle(m),
				column: i + 1
			});

			if (i + 1 === this.segments) {
				// Set end date
				this._endDateMoment = m;
				this._endDate = m.toDate();
			}
		}
	}

	get startDate(): Date {
		return this._startDate;
	}

	get endDate(): Date {
		return this._endDate;
	}

	/*get weekNumberKey(date): string {

	}*/
}
