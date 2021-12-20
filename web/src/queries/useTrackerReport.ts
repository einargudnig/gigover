import axios from 'axios';
import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import moment from 'moment';

export interface Timesheet {
	minutes: number;
	projectId: number;
	start: number; // Timestamp
	stop: number; // Timestamp
	taskId: number;
	workId: number;
}

export interface TrackerReportItem {
	email: string;
	name: string;
	phoneNumber: string;
	timeSheets: Timesheet[];
	uId: string;
	userName: string;
}

interface TrackerReportResponse {
	data: {
		report: TrackerReportItem[];
	};
}

interface TrackerReportInput {
	projectId?: number;
	from?: number;
	to?: number;
	taskId?: number;
}

export const useTrackerReport = () => {
	return useMutation<TrackerReportResponse, ErrorResponse, TrackerReportInput>(
		async (variables = {}) => {
			const startTime = moment(variables.from);
			const endTime = moment(variables.to);

			const startOfDay = moment(startTime).startOf('day');
			const endOfDay = moment(endTime).endOf('day');

			return await axios.post(
				ApiService.timerReport,
				{
					...variables,
					from: startOfDay.toDate().getTime(),
					to: endOfDay.toDate().getTime()
				},
				{ withCredentials: true }
			);
		}
	);
};
