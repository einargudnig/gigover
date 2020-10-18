import { useProjectList } from '../../queries/useProjectList';
import { Project, WorkerItem } from '../../models/Project';
import { useEffect, useMemo } from 'react';
import { Timesheet, useTrackerReport } from '../../queries/useTrackerReport';
import { Moment } from 'moment';
import { secondsToString } from '../../utils/NumberUtils';

type TimeTrackerReportResultItem = {
	projectName: string;
	taskName: string;
	worker: WorkerItem;
	timesheet: Pick<Timesheet, 'start' | 'stop' | 'workId'>;
};

interface TimeTrackerReportResult {
	isLoading: boolean;
	users: { userId: string; name: string }[];
	results: TimeTrackerReportResultItem[];
	projectMap: Map<number, Project>;
	projectList: Project[];
	totalTracked: string;
}

export const useTimeTrackerReport = (
	startDate: Moment,
	endDate: Moment,
	refetch = 0,
	workerId?: string,
	projectId?: number
): TimeTrackerReportResult => {
	const startDateTimestamp = startDate.unix() * 1000;
	const endDateTimestamp = endDate.unix() * 1000;
	const [getReport, { data, isLoading: isGetReportLoading }] = useTrackerReport();
	const { data: projectList, isLoading: projectDataListLoading } = useProjectList();

	const projectMap: Map<number, Project> = useMemo(() => {
		const pMap = new Map<number, Project>();
		const projects = projectList?.projects || [];
		const reportData = data?.data || undefined;

		if (reportData && projects.length > 0) {
			reportData.report.forEach((reportSheet) => {
				reportSheet.timeSheets.forEach((ts) => {
					if (!pMap.get(ts.projectId)) {
						const project = projects.find((p) => p.projectId === ts.projectId);
						if (project) {
							pMap.set(ts.projectId, project);
						}
					}
				});
			});
		}

		return pMap;
	}, [data, projectList]);

	const users =
		data?.data?.report?.map((reportSheet) => ({
			userId: reportSheet.uId,
			name: reportSheet.name
		})) ?? [];

	const results: TimeTrackerReportResultItem[] = useMemo(() => {
		let reports = data?.data?.report ?? [];

		if (reports.length > 0) {
			// Filter by Worker
			reports = reports.filter((value) => (workerId ? value.uId === workerId : true));

			return reports.flatMap((value) =>
				value.timeSheets
					// Filter by Project
					.filter((ts) => (projectId ? ts.projectId === projectId : true))
					// Only show finished timers
					.filter((ts) => ts.start && ts.stop)
					.map((ts) => {
						const project = projectMap.get(ts.projectId);
						const task = project?.tasks.find((t) => t.taskId === ts.taskId);

						return {
							projectName: project?.name ?? 'Unknown Project',
							taskName: task?.text ?? 'Unknown',
							timesheet: { start: ts.start, stop: ts.stop, workId: ts.workId },
							worker: value
						};
					})
			);
		}

		return [];
	}, [data, projectMap, startDateTimestamp, endDateTimestamp, workerId, projectId]);

	const totalTracked = (() => {
		if (results.length > 0) {
			let totalUnix = 0;
			results.forEach((res) => {
				totalUnix = totalUnix + (res.timesheet.stop - res.timesheet.start);
			});

			return secondsToString(totalUnix / 1000);
		}

		return secondsToString(0);
	})();

	useEffect(() => {
		getReport({
			from: startDateTimestamp,
			to: endDateTimestamp,
			projectId
		});
	}, [refetch, startDateTimestamp, endDateTimestamp, projectId]);

	return {
		projectMap,
		projectList: projectList?.projects || [],
		users,
		results,
		totalTracked,
		isLoading: projectDataListLoading || isGetReportLoading
	};
};
