import { Dispatch, useReducer } from 'react';
import { Project } from '../../../models/Project';

export type CalendarType = 'Days' | 'Weeks' | 'Months';

type GantChartReducerAction =
	| { type: 'SetCalendarType'; payload: CalendarType }
	| { type: 'IncreaseOffset' }
	| { type: 'DecreaseOffset' }
	| { type: 'SetSegments'; payload: number }
	| { type: 'SetProject'; payload: Project };

// interface GantChartDate {
// 	date: Date;
// }

interface GantChart {
	date: Date;
	dateOffset: number;
	segments: number;
	project: Project | null;
	type: CalendarType;
}

export type GantChartReducer = [GantChart, Dispatch<GantChartReducerAction>];

const reducer = (state: GantChart, action: GantChartReducerAction) => {
	// Re-calculate segments helper

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

			return {
				...state,
				dateOffset: state.dateOffset + addition
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
			return { min: 7, max: 90, defaultValue: 30 };
		case 'Months':
			return { min: 1, max: 24, defaultValue: 12 };
		case 'Weeks':
			return { min: 1, max: 52, defaultValue: 10 };
	}

	throw new Error('Invalid CalendarType in getMinMaxForCalendarType');
};
