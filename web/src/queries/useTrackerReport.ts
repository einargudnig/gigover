import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
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
	return useMutation<TrackerReportAPIResponse, Error, TrackerReportMutationVariables | void>({
		mutationFn: async (variables) => {
			const fromTime =
				variables && variables.from
					? variables.from
					: moment().subtract(14, 'days').valueOf();
			const toTime = variables && variables.to ? variables.to : moment().valueOf();

			const startTime = moment(fromTime);
			const endTime = moment(toTime);

			const startOfDay = moment(startTime).startOf('day');
			const endOfDay = moment(endTime).endOf('day');

			const payload: TrackerReportMutationVariables = {};
			if (variables?.projectId) {
				payload.projectId = variables.projectId;
			}
			if (variables?.taskId) {
				payload.taskId = variables.taskId;
			}
			payload.from = startOfDay.toDate().getTime();
			payload.to = endOfDay.toDate().getTime();

			return axios.post(ApiService.timerReport, payload, { withCredentials: true });
		}
	});
};
