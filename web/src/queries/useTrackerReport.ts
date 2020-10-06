import axios from 'axios';
import { useMutation } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';

interface Timesheet {
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
}

export const useTrackerReport = () => {
	return useMutation<TrackerReportResponse, ErrorResponse, TrackerReportInput>(
		async (variables = {}) =>
			await axios.post(ApiService.timerReport, variables, { withCredentials: true })
	);
};
