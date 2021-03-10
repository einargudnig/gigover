import { Dispatch, useReducer } from 'react';
import { Project } from '../../../models/Project';
import moment, { DurationInputArg2 } from 'moment';

export const GRID_SIDEBAR_WIDTH = '300px';
export const GRID_ROW_HEIGHT = '50px';

export type CalendarType = 'Days' | 'Weeks' | 'Months';

type GantChartReducerAction =
	| { type: 'SetCalendarType'; payload: CalendarType }
	| { type: 'IncreaseOffset' }
	| { type: 'DecreaseOffset' }
	| { type: 'SetSegments'; payload: number }
	| { type: 'SetProject'; payload: Project };

interface GantChart {
	date: Date;
	dateOffset: number;
	segments: number;
	project: Project | null;
	type: CalendarType;
}

interface GantChartState extends GantChart {
	initialDate: Date;
}

export type GantChartReducer = [GantChart, Dispatch<GantChartReducerAction>];

const reducer = (state: GantChartState, action: GantChartReducerAction) => {
	switch (action.type) {
		case 'SetCalendarType': {
			// Validate minMax for the new Type
			const minMax = getMinMaxForCalendarType(action.payload);

			return {
				...state,
				segments: Math.min(Math.max(state.segments, minMax.max), minMax.min),
				type: action.payload
			};
		}
		case 'SetSegments': {
			return {
				...state,
				segments: action.payload
			};
		}
		case 'DecreaseOffset':
		case 'IncreaseOffset': {
			const addition = action.type === 'DecreaseOffset' ? -1 : 1;
			const newOffset = state.dateOffset + addition;
			const newDate = moment(state.initialDate)
				.add(newOffset * state.segments, state.type.toLowerCase() as DurationInputArg2)
				.toDate();

			return {
				...state,
				date: newDate,
				dateOffset: newOffset
			};
		}
		case 'SetProject': {
			return {
				...state,
				project: action.payload
			};
		}
	}

	return state;
};

export const InitialGantChartState: GantChart = {
	date: new Date(),
	dateOffset: 0,
	segments: 1,
	type: 'Days',
	project: null
};

export const useGantChart = ({
	initialState
}: {
	initialState: Omit<GantChart, 'segments'>;
}): GantChartReducer => {
	return useReducer(reducer, {
		date: initialState.date,
		initialDate: initialState.date,
		dateOffset: initialState.dateOffset,
		segments: getMinMaxForCalendarType(initialState.type).defaultValue,
		type: initialState.type,
		project: initialState.project
	});
};

/* Helper functions */
export const getMinMaxForCalendarType = (type: CalendarType) => {
	switch (type) {
		case 'Days':
			return { min: 7, max: 31, defaultValue: 30 };
		case 'Weeks':
			return { min: 3, max: 52, defaultValue: 10 };
		case 'Months':
			return { min: 5, max: 24, defaultValue: 12 };
	}

	throw new Error('Invalid CalendarType in getMinMaxForCalendarType');
};

interface DateSegment {
	moment: moment.Moment;
	title: string;
	subtitle: string;
}

const getTitle = (type: CalendarType, m: moment.Moment) => {
	switch (type) {
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
			throw new Error(`Invalid type '${type}' in useGantChart.getTitle`);
	}
};

const getSubtitle = (type: CalendarType, m: moment.Moment) => {
	switch (type) {
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
			throw new Error(`Invalid type '${type}' in useGantChart.getTitle`);
	}
};

export const getDateSegments = (
	type: CalendarType,
	segments: number,
	date: Date
): DateSegment[] => {
	const mid = Math.ceil(segments / 2);
	const durationAddition = type as DurationInputArg2;
	const firstDate = moment(date).add(-(segments - mid), durationAddition);
	const dates = [];

	for (let i = 0; i < segments; i++) {
		// Clone the firstDate by wrapping moment so it won't add to it.
		const m = moment(firstDate).add(i, durationAddition);

		dates.push({
			moment: m,
			title: getTitle(type, m),
			subtitle: getSubtitle(type, m)
		});
	}

	return dates;
};
