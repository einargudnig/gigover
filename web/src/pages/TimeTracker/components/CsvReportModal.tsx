import { Button, Flex } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Modal } from '../../../components/Modal';
import { TrackerSelect } from '../../../components/TrackerSelect';
import { Project, WorkerItem } from '../../../models/Project';
import { Task } from '../../../models/Task';
import { displayTaskTitle } from '../../../utils/TaskUtils';
import { useTimeTrackerReport } from '../useTimeTrackerReport';

export interface CsvReportModalProps {
	startDate: DateTime;
	endDate: DateTime;
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
								?.tasks.map((task) => ({
									value: task.taskId,
									label: displayTaskTitle(task)
								})) ?? []
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
