import { useProjectList } from '../../queries/useProjectList';
import { Project, WorkerItem } from '../../models/Project';
import { useEffect, useMemo, useState } from 'react';
import { Timesheet, useTrackerReport } from '../../queries/useTrackerReport';
import { Moment } from 'moment';
import { secondsToHHMMSS } from '../../utils/NumberUtils';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { displayTaskTitle } from '../../utils/TaskUtils';

export type TimeTrackerReportResultItem = {
	projectId: number;
	taskId: number;
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
	projectId?: number,
	selectedTask?: number
): TimeTrackerReportResult => {
	const startDateTimestamp = startDate.unix() * 1000;
	const endDateTimestamp = endDate.unix() * 1000;
	const [totalTracked, setTotalTracked] = useState<string>(secondsToHHMMSS(0));
	const { mutate: getReport, data, isLoading: isGetReportLoading } = useTrackerReport();
	const { data: projects, isLoading: projectDataListLoading } = useProjectList();

	const openProjects = useOpenProjects(projects);

	const projectMap: Map<number, Project> = useMemo(() => {
		const pMap = new Map<number, Project>();
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
	}, [data, projects]);

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
							projectId: project?.projectId ?? -1,
							taskId: task?.taskId ?? -1,
							projectName: project?.name ?? 'Unknown Project',
							taskName: displayTaskTitle(task),
							timesheet: { start: ts.start, stop: ts.stop, workId: ts.workId },
							worker: value
						};
					})
			);
		}

		return [];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, projectMap, startDateTimestamp, endDateTimestamp, workerId, projectId]);

	useEffect(() => {
		if (results.length > 0) {
			let totalSeconds = 0;
			results.forEach((res) => {
				totalSeconds =
					totalSeconds + (res.timesheet.stop / 1000 - res.timesheet.start / 1000);
			});

			setTotalTracked(secondsToHHMMSS(totalSeconds));
			return;
		}

		setTotalTracked(secondsToHHMMSS(0));
	}, [results]);

	useEffect(() => {
		getReport({
			from: startDateTimestamp,
			to: endDateTimestamp,
			projectId,
			taskId: selectedTask
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetch, startDateTimestamp, endDateTimestamp, projectId, selectedTask]);

	return {
		projectMap,
		projectList: openProjects,
		users,
		results,
		totalTracked,
		isLoading: projectDataListLoading || isGetReportLoading
	};
};
