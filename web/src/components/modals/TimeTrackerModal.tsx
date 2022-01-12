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
import { WorkerItem } from '../../models/Project';
import { Task } from '../../models/Task';
import { SubstringText } from '../../utils/StringUtils';
import { useTrackerStart } from '../../queries/useTrackerStart';
import { useOpenProjects } from '../../hooks/useAvailableProjects';
import { useProjectTasks } from '../../hooks/useProjectTasks';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { Box, HStack, Text } from '@chakra-ui/react';
import { DatePickerWrapper } from '../../pages/TimeTracker/TimeTrackerReport';
import { SingleDatePicker } from 'react-dates';
import { MomentDateFormat } from '../../utils/MomentDateFormat';
import moment from 'moment';
import { addZeroBefore } from '../../utils/NumberUtils';
import { range } from '../../utils/ArrayUtils';
import { useWorkAdd } from '../../queries/useWorkAdd';

interface TimeTrackerModalProps {
	context: ITimeTrackerModalContext;
}

export const TimeTrackerModal = ({ context }: TimeTrackerModalProps): JSX.Element => {
	const { data } = useProjectList();
	const closeModal = useCloseModal();

	// For creation
	const [isCreate, setIsCreate] = useState(false);
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [focusedStart, setFocusedStart] = useState<boolean>(false);
	const [focusedEnd, setFocusedEnd] = useState<boolean>(false);
	const { mutateAsync: workAdd } = useWorkAdd();

	// For starting timers
	const [selectedProject, setSelectedProject] = useState<number | undefined>();
	const [selectedWorker, setSelectedWorker] = useState<string | undefined>();
	const [selectedTask, setSelectedTask] = useState<number | undefined>();
	const { mutateAsync: startTask } = useTrackerStart();
	const openProjects = useOpenProjects(data);
	const isEmpty = !data || openProjects.length <= 0;

	const currentProject = useMemo(() => {
		setSelectedWorker(undefined);
		setSelectedTask(undefined);

		if (data && data.length > 0) {
			return data.find((p) => p.projectId === selectedProject);
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

	const tasks: Task[] = useProjectTasks(currentProject);

	const isSubmitDisabled = useMemo(() => {
		return !(selectedProject && selectedTask && selectedWorker);
	}, [selectedProject, selectedTask, selectedWorker]);

	const startTracker = useCallback(async () => {
		if (selectedProject && selectedTask && selectedWorker) {
			if (isCreate) {
				try {
					await workAdd({
						projectId: selectedProject,
						taskId: selectedTask!,
						workerUId: selectedWorker,
						start: startTime.getTime(),
						stop: endTime.getTime()
					});

					if (!context.callback) {
						window.location.pathname = '/time-tracker';
					} else {
						context.callback();
					}
					closeModal();
				} catch (e) {
					console.error(e);
					alert("Couldn't create timer, please try again");
				}
			} else {
				try {
					await startTask({
						projectId: selectedProject,
						taskId: selectedTask,
						uId: selectedWorker
					});

					if (!context.callback) {
						window.location.pathname = '/time-tracker';
					} else {
						context.callback();
					}
					closeModal();
				} catch (e) {
					console.error(e);
					alert("Couldn't start timer, please try again");
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		closeModal,
		selectedProject,
		selectedTask,
		selectedWorker,
		startTask,
		isCreate,
		startTime,
		endTime
	]);

	return (
		<Modal
			title={
				<>
					<TimeIcon size={32} color={Theme.colors.yellow} type={'solid'} />
					<div>Time tracker</div>
				</>
			}
			open={true}
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
								label: SubstringText(displayTaskTitle(task), 70),
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
						<div>
							<Text
								mt={2}
								textDecoration={'underline'}
								cursor={'pointer'}
								onClick={() => setIsCreate(!isCreate)}
							>
								{!isCreate
									? 'Start a timer with start and end date.'
									: 'Start timer manually'}
							</Text>
							{isCreate && (
								<Box mt={4}>
									<HStack spacing={4} width="100%" sx={{ flex: 1 }}>
										<DatePickerWrapper style={{ margin: '8px 0', flex: 1 }}>
											<SingleDatePicker
												id={'startTime'}
												displayFormat={MomentDateFormat}
												date={moment(startTime)}
												onDateChange={(md) =>
													setStartTime(md?.toDate() ?? startTime)
												}
												focused={focusedStart}
												isOutsideRange={() => false}
												onFocusChange={(f) => setFocusedStart(f.focused)}
											/>
										</DatePickerWrapper>
										<Box flex={1}>
											<TrackerSelect
												title={'Hour started'}
												value={addZeroBefore(startTime.getHours())}
												isNumber={true}
												options={range(0, 23).map((i) => ({
													value: i,
													label: addZeroBefore(i)
												}))}
												valueChanged={(newValue) => {
													const date = startTime;
													date.setHours(Number(newValue));
													setStartTime(date);
												}}
											/>
										</Box>
										<Box flex={1}>
											<TrackerSelect
												title={'Minute started'}
												value={addZeroBefore(startTime.getMinutes())}
												isNumber={true}
												options={range(0, 59).map((i) => ({
													value: i,
													label: addZeroBefore(i)
												}))}
												valueChanged={(newValue) => {
													const date = startTime;
													date.setMinutes(Number(newValue));
													setStartTime(date);
												}}
											/>
										</Box>
									</HStack>
									<HStack mt={4} spacing={4} width="100%" sx={{ flex: 1 }}>
										<DatePickerWrapper style={{ margin: '8px 0', flex: 1 }}>
											<SingleDatePicker
												id={'endTime'}
												displayFormat={MomentDateFormat}
												date={moment(endTime)}
												onDateChange={(md) =>
													setEndTime(md?.toDate() ?? endTime)
												}
												focused={focusedEnd}
												isOutsideRange={() => false}
												onFocusChange={(f) => setFocusedEnd(f.focused)}
											/>
										</DatePickerWrapper>
										<Box flex={1}>
											<TrackerSelect
												title={'Hour ended'}
												value={addZeroBefore(endTime.getHours())}
												isNumber={true}
												options={range(0, 23).map((i) => ({
													value: i,
													label: addZeroBefore(i)
												}))}
												valueChanged={(newValue) => {
													const date = endTime;
													date.setHours(Number(newValue));
													setEndTime(date);
												}}
											/>
										</Box>
										<Box flex={1}>
											<TrackerSelect
												title={'Minute ended'}
												value={addZeroBefore(endTime.getMinutes())}
												isNumber={true}
												options={range(0, 59).map((i) => ({
													value: i,
													label: addZeroBefore(i)
												}))}
												valueChanged={(newValue) => {
													const date = endTime;
													date.setMinutes(Number(newValue));
													setEndTime(date);
												}}
											/>
										</Box>
									</HStack>
								</Box>
							)}
						</div>
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
