import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { DateTime } from 'luxon';
import { ApiService } from '../services/ApiService';

export interface Timesheet {
	minutes: number;
	projectId: number;
	start: number; // Timestamp
	stop: number; // Timestamp
	taskId: number;
	workId: number;
	comment?: string;
	userName?: string;
}

export interface TrackerReportItem {
	email: string;
	name: string;
	phoneNumber: string;
	timeSheets: Timesheet[];
	uId: string;
	userName: string;
}

export interface TrackerReportAPIResponse {
	data: {
		report: TrackerReportItem[];
	};
}

interface TrackerReportMutationVariables {
	projectId?: number;
	from?: number;
	to?: number;
	taskId?: number;
}

export const useTrackerReport = () => {
	console.log('useTrackerReport');

	return useMutation<TrackerReportAPIResponse, Error, TrackerReportMutationVariables | void>({
		mutationFn: async (variables) => {
			const fromTime =
				variables && variables.from
					? variables.from
					: DateTime.now().minus({ days: 14 }).toMillis();
			const toTime = variables && variables.to ? variables.to : DateTime.now().toMillis();

			const startTime = DateTime.fromMillis(fromTime);
			const endTime = DateTime.fromMillis(toTime);

			const startOfDay = startTime.startOf('day');
			const endOfDay = endTime.endOf('day');

			const payload: TrackerReportMutationVariables = {};
			if (variables?.projectId) {
				payload.projectId = variables.projectId;
			}
			if (variables?.taskId) {
				payload.taskId = variables.taskId;
			}
			payload.from = startOfDay.toMillis();
			payload.to = endOfDay.toMillis();

			return axios.post(ApiService.timerReport, payload, { withCredentials: true });
		}
	});
};
