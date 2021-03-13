import React, { useCallback, useMemo, useState } from 'react';
import { TimeIcon } from '../icons/TimeIcon';
import { Theme } from '../../Theme';
import { TrackerSelect } from '../TrackerSelect';
import { FormActions } from '../FormActions';
import { Modal } from '../Modal';
import { useCloseModal } from '../../hooks/useCloseModal';
import { ITimeTrackerModalContext } from '../../context/ModalContext';
import { useProjectList } from '../../queries/useProjectList';
import { EmptyState } from '../empty/EmptyState';
import { ProjectStatus, WorkerItem } from '../../models/Project';
import { Task } from '../../models/Task';
import { SubstringText } from '../../utils/StringUtils';
import { useTrackerStart } from '../../queries/useTrackerStart';

interface TimeTrackerModalProps {
	context: ITimeTrackerModalContext;
}

export const TimeTrackerModal = ({ context }: TimeTrackerModalProps): JSX.Element => {
	const { data } = useProjectList();
	const closeModal = useCloseModal();
	const [selectedProject, setSelectedProject] = useState<number | undefined>();
	const [selectedWorker, setSelectedWorker] = useState<string | undefined>();
	const [selectedTask, setSelectedTask] = useState<number | undefined>();
	const { mutateAsync: startTask } = useTrackerStart();
	const openProjects = useMemo(() => {
		if (data && data.projects) {
			return data.projects.filter((p) => p.status === ProjectStatus.OPEN);
		}
		return [];
	}, [data]);
	const isEmpty = !data || openProjects.length <= 0;

	const currentProject = useMemo(() => {
		setSelectedWorker(undefined);
		setSelectedTask(undefined);

		if (data && data.projects.length > 0) {
			return data.projects.find((p) => p.projectId === selectedProject);
		}

		return null;
	}, [data, selectedProject]);

	const workers: WorkerItem[] = useMemo(() => {
		if (currentProject) {
			return currentProject ? currentProject.workers : [];
		} else {
			return [];
		}
	}, [currentProject]);

	const tasks: Task[] = useMemo(() => {
		if (currentProject) {
			return currentProject ? currentProject.tasks : [];
		} else {
			return [];
		}
	}, [currentProject]);

	const isSubmitDisabled = useMemo(() => {
		return !(selectedProject && selectedTask && selectedWorker);
	}, [selectedProject, selectedTask, selectedWorker]);

	const startTracker = useCallback(() => {
		if (selectedProject && selectedTask && selectedWorker) {
			startTask({
				projectId: selectedProject,
				taskId: selectedTask,
				uId: selectedWorker
			})
				.then(() => {
					if (!context.callback) {
						window.location.pathname = '/time-tracker';
					} else {
						context.callback();
					}
					closeModal();
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [closeModal, selectedProject, selectedTask, selectedWorker, startTask]);

	return (
		<Modal
			title={
				<>
					<TimeIcon color={Theme.colors.green} />
					<div>Time tracker</div>
				</>
			}
			open={true}
			centerModal={true}
			closeIcon={false}
			onClose={() => closeModal()}
		>
			<>
				{isEmpty && openProjects.length <= 0 ? (
					<EmptyState
						title={'No projects'}
						text={
							'You have to create some projects and add workers before you can track'
						}
					/>
				) : (
					<>
						<TrackerSelect
							title={'Select a project'}
							value={selectedProject}
							options={openProjects.map((project) => ({
								label: project.name,
								value: project.projectId
							}))}
							valueChanged={(newValue) => {
								if (newValue === '') {
									setSelectedProject(undefined);
								} else {
									setSelectedProject((newValue as number) ?? undefined);
								}
							}}
						/>
						<TrackerSelect
							title={'Select a worker'}
							value={selectedWorker}
							options={workers.map((worker) => ({
								label: worker.name,
								value: worker.uId
							}))}
							isNumber={false}
							valueChanged={(newValue) => {
								if (newValue === '') {
									setSelectedWorker(undefined);
								} else {
									setSelectedWorker((newValue as string) ?? undefined);
								}
							}}
						/>
						<TrackerSelect
							title={'Select a task'}
							value={selectedTask}
							options={tasks.map((task) => ({
								label: SubstringText(task.text, 70),
								value: task.taskId
							}))}
							valueChanged={(newValue) => {
								if (newValue === '') {
									setSelectedTask(undefined);
								} else {
									setSelectedTask((newValue as number) ?? undefined);
								}
							}}
						/>
					</>
				)}
				<FormActions
					submitDisabled={isEmpty || isSubmitDisabled}
					onSubmit={() => startTracker()}
					submitText={'Start tracking'}
					onCancel={() => closeModal()}
					cancelText={'Close'}
					style={{ paddingBottom: 0 }}
				/>
			</>
		</Modal>
	);
};
