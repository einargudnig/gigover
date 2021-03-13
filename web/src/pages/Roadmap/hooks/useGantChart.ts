import { Dispatch, useReducer } from 'react';
import { Project } from '../../../models/Project';
import moment, { DurationInputArg2 } from 'moment';
import { Milestone } from '../../../models/Milestone';

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
	milestones: Milestone[];
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
			if (state.project) {
				// TODO Find new milestones when project is switched
				// Maybe project shouldn't be in here, only milestones

				return {
					...state,
					milestones: [],
					project: action.payload
				};
			}

			return {
				...state,
				project: null
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
	project: null,
	milestones: []
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
		project: initialState.project,
		milestones: initialState.milestones
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
