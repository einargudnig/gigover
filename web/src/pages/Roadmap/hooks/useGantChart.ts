import { DateTime, Duration, DurationLikeObject } from 'luxon';
import { Dispatch, useReducer } from 'react';
import { Milestone } from '../../../models/Milestone';
import { Project } from '../../../models/Project';
import { TaskItem } from '../../../models/Task';

export const GRID_SIDEBAR_WIDTH = '300px';
export const GRID_ROW_HEIGHT = '55px';

export type CalendarType = 'Days' | 'Weeks' | 'Months';

type GantChartReducerAction =
	| { type: 'SetCalendarType'; payload: CalendarType }
	| { type: 'IncreaseOffset' }
	| { type: 'DecreaseOffset' }
	| { type: 'SetSegments'; payload: number }
	| { type: 'SetProject'; payload: Project }
	| { type: 'SetMilestones'; payload: Milestone[] }
	| { type: 'ToggleMilestone'; payload: Milestone };

interface GantChart {
	date: Date;
	dateOffset: number;
	segments: number;
	project: Project | null;
	type: CalendarType;
	tasks: TaskItem[];
	milestones: Milestone[];
	rows: number;
	expanded: Map<number, boolean>;
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
			const lowerCaseType = state.type.toLowerCase();
			// Ensure the unit is plural (e.g., 'days', 'weeks', 'months')
			const durationUnit = lowerCaseType.endsWith('s') ? lowerCaseType : `${lowerCaseType}s`;
			const newDate = DateTime.fromJSDate(state.initialDate)
				.plus(
					Duration.fromObject({
						[durationUnit]: newOffset * state.segments
					} as DurationLikeObject)
				)
				.toJSDate();

			return {
				...state,
				date: newDate,
				dateOffset: newOffset
			};
		}
		case 'SetProject': {
			if (state.project) {
				return {
					...state,
					milestones: [],
					project: action.payload,
					tasks: action.payload.tasks.map((t) => new TaskItem(t))
				};
			}

			return {
				...state,
				project: null
			};
		}
		case 'SetMilestones': {
			const milestones = action.payload;
			const filterOutTaskIds = milestones.flatMap((m) => m.projectTasks.map((t) => t.taskId));
			const tasks = state.tasks.filter((t) => !filterOutTaskIds.includes(t.taskId));

			return {
				...state,
				tasks: tasks,
				rows: action.payload.length + tasks.length,
				expanded: new Map<number, boolean>(),
				milestones
			};
		}
		case 'ToggleMilestone': {
			const map = state.expanded;
			const id = action.payload.milestoneId;
			let rows = state.rows;

			if (map.has(id)) {
				map.delete(id);
				rows = rows - action.payload.projectTasks.length;
			} else {
				map.set(id, true);
				rows = rows + action.payload.projectTasks.length;
			}

			return {
				...state,
				rows,
				expanded: map
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
	tasks: [],
	milestones: [],
	rows: 0,
	expanded: new Map<number, boolean>()
};

export const useGantChart = ({
	initialState
}: {
	initialState: Omit<GantChart, 'segments' | 'rows' | 'expanded'>;
}): GantChartReducer => {
	return useReducer(reducer, {
		date: initialState.date,
		initialDate: initialState.date,
		dateOffset: initialState.dateOffset,
		segments: getMinMaxForCalendarType(initialState.type).defaultValue,
		type: initialState.type,
		project: initialState.project,
		tasks: initialState.project?.tasks.map((t) => new TaskItem(t)) || [],
		milestones: initialState.milestones,
		rows: initialState.milestones.length,
		expanded: new Map<number, boolean>()
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
