import React, { useCallback, useState } from 'react';
import { Modal } from '../../../components/Modal';
import { useTimeTrackerReport } from '../useTimeTrackerReport';
import { Moment } from 'moment';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { TrackerSelect } from '../../../components/TrackerSelect';
import { Project, WorkerItem } from '../../../models/Project';
import { Task } from '../../../models/Task';
import { useReportToCSV } from '../../../mutations/useReportToCSV';
import { Button, Flex } from '@chakra-ui/react';

export interface CsvReportModalProps {
	startDate: Moment;
	endDate: Moment;
	onClose: () => void;
}

export const CsvReportModal = ({
	startDate,
	endDate,
	onClose
}: CsvReportModalProps): JSX.Element => {
	const timeTrackerReport = useTimeTrackerReport(startDate, endDate);
	const projects = timeTrackerReport.projectList;
	const [selectedProject, setSelectedProject] = useState<Project | undefined>();
	const [selectedWorker, setSelectedWorker] = useState<WorkerItem | undefined>();
	const [selectedTask, setSelectedTask] = useState<Task | undefined>();
	const reportToCSV = useReportToCSV();

	const exportToCsv = useCallback(async () => {
		try {
			const parameterString: string[] = [];

			if (selectedProject) {
				parameterString.push(`projectId=${selectedProject.projectId}`);
			}

			if (selectedTask) {
				parameterString.push(`taskId=${selectedTask.taskId}`);
			}

			if (selectedWorker) {
				parameterString.push(`workerId=${selectedWorker.uId}`);
			}

			const response = await reportToCSV.mutateAsync({
				name: 'workReport',
				parameters: parameterString.join('|')
			});

			console.log('response', response);
		} catch (e) {
			console.error(e);
			alert('Could not export to CSV, contact support or try again later.');
		}
	}, [selectedProject, selectedTask, selectedWorker]);

	return (
		<Modal open={true} onClose={onClose} title={'Report to CSV'} centerModal={true}>
			{timeTrackerReport.isLoading ? (
				<LoadingSpinner />
			) : (
				<div>
					<TrackerSelect
						title={'Project'}
						value={selectedProject?.projectId}
						options={
							projects?.map((project) => {
								return { value: project.projectId, label: project.name };
							}) ?? []
						}
						valueChanged={(newValue) =>
							setSelectedProject(projects.find((p) => p.projectId === newValue)!)
						}
					/>
					<TrackerSelect
						title={'Task'}
						value={selectedTask?.taskId}
						options={
							projects
								.find((p) => p.projectId === selectedProject?.projectId)
								?.tasks.map((task) => ({ value: task.taskId, label: task.text })) ??
							[]
						}
						valueChanged={(newValue) =>
							setSelectedTask(
								selectedProject?.tasks.find((pt) => pt.taskId === newValue)
							)
						}
					/>
					<TrackerSelect
						title={'Worker'}
						value={selectedWorker?.uId}
						options={
							selectedProject?.workers?.map((w) => ({
								label: w.name,
								value: w.uId
							})) ?? []
						}
						isNumber={false}
						valueChanged={(newValue) =>
							setSelectedWorker(
								selectedProject!.workers.find((w) => w.uId === newValue)!
							)
						}
					/>
					<Flex mt={6} justify="space-between" align="center">
						<Button onClick={() => onClose()}>Close</Button>
						<Button
							onClick={async () => {
								await exportToCsv();
								onClose();
							}}
						>
							Export
						</Button>
					</Flex>
				</div>
			)}
		</Modal>
	);
};
