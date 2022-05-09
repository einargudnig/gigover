import React, { useEffect, useRef, useState } from 'react';
import { TimeIcon } from '../icons/TimeIcon';
import { Theme } from '../../Theme';
import { TrackerSelect } from '../TrackerSelect';
import { FormActions } from '../FormActions';
import { Modal } from '../Modal';
import { useCloseModal } from '../../hooks/useCloseModal';
import { IEditTimeTrackerModalContext } from '../../context/ModalContext';
import { useModifyTimeRecord } from '../../mutations/useModifyTimeRecord';
import { LoadingSpinner } from '../LoadingSpinner';
import { range } from '../../utils/ArrayUtils';
import { useProjectList } from '../../queries/useProjectList';
import { Project } from '../../models/Project';
import { Task } from '../../models/Task';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import { DatePickerWrapper } from '../../pages/TimeTracker/TimeTrackerReport';
import { addZeroBefore } from '../../utils/NumberUtils';
import { Box, HStack, Tag, Text } from '@chakra-ui/react';
import { MomentDateFormat } from '../../utils/MomentDateFormat';
import { displayTaskTitle } from '../../utils/TaskUtils';
import { Input } from '../forms/Input';

interface TimeTrackerModalProps {
	context: IEditTimeTrackerModalContext;
}

export const EditTimeTrackerModal = ({
	context: { callback, reportItem }
}: TimeTrackerModalProps): JSX.Element => {
	const firstRun = useRef(true);
	const { data: projects } = useProjectList();
	const [comment, setComment] = useState('');
	const [startTime, setStartTime] = useState(new Date(reportItem.timesheet.start));
	const [endTime, setEndTime] = useState(new Date(reportItem.timesheet.stop));

	// @ts-ignore
	const [selectedProject, setSelectedProject] = useState<Project | undefined>({
		name: reportItem.projectName,
		projectId: reportItem.projectId,
		tasks: []
	});

	// @ts-ignore
	const [selectedTask, setSelectedTask] = useState<Task | undefined>({
		text: reportItem.taskName,
		taskId: reportItem.taskId
	});

	const closeModal = useCloseModal(callback);
	const { mutateAsync: modifyTimeRecord, isLoading, isError, error } = useModifyTimeRecord();

	const [focusedStart, setFocusedStart] = useState<boolean>(false);
	const [focusedEnd, setFocusedEnd] = useState<boolean>(false);

	const update = async () => {
		if (!selectedProject?.projectId || !selectedTask?.taskId) {
			alert('You need to select a project and a task.');
			return;
		}

		try {
			// Make sure its on the 0 second.
			startTime.setSeconds(0);
			endTime.setSeconds(0);

			await modifyTimeRecord({
				workId: reportItem.timesheet.workId,
				projectId: selectedProject?.projectId,
				taskId: selectedTask?.taskId,
				start: startTime.getTime(),
				stop: endTime.getTime(),
				comment: comment
			});

			closeModal();
		} catch (e) {
			console.error('Error', e);
		}
	};

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false;
			return;
		}
		// Changing project needs to reset the selected task
		setSelectedTask(undefined);
	}, [selectedProject]);

	return (
		<Modal
			title={
				<>
					<TimeIcon color={Theme.colors.green} />
					<div>Edit Time Record</div>
					{isLoading && <LoadingSpinner />}
				</>
			}
			open={true}
			centerModal={false}
			closeIcon={false}
			onClose={() => closeModal()}
		>
			{isError && (
				<Box mb={4}>
					<Text color="red">
						{error?.toString() ?? 'Unknown error, please try again.'}
					</Text>
				</Box>
			)}
			<TrackerSelect
				title={'Worker'}
				value={reportItem.worker.uId}
				options={[{ value: reportItem.worker.uId, label: reportItem.worker.name }]}
				disabled={true}
				isNumber={false}
				valueChanged={() => null}
			/>
			<TrackerSelect
				title={'Project'}
				value={selectedProject?.projectId}
				options={
					projects?.map((project) => {
						return { value: project.projectId, label: project.name };
					}) ?? [{ value: reportItem.projectId, label: reportItem.projectName }]
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
						?.tasks.map((task) => {
							return { value: task.taskId, label: displayTaskTitle(task) };
						}) ?? [{ value: reportItem.taskId, label: reportItem.taskName }]
				}
				valueChanged={(newValue) =>
					setSelectedTask(selectedProject?.tasks.find((pt) => pt.taskId === newValue))
				}
			/>
			<Box my={4}>
				<Tag mb={4}>Work start date and time</Tag>
				<HStack spacing={4} width="100%" sx={{ flex: 1 }}>
					<DatePickerWrapper style={{ margin: '8px 0', flex: 1 }}>
						<SingleDatePicker
							id={'startTime'}
							displayFormat={MomentDateFormat}
							date={moment(startTime)}
							onDateChange={(md) => setStartTime(md?.toDate() ?? startTime)}
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
			</Box>
			<Box my={4}>
				<Tag mb={4}>Work end date and time</Tag>
				<HStack spacing={4} width="100%" sx={{ flex: 1 }}>
					<DatePickerWrapper style={{ margin: '8px 0', flex: 1 }}>
						<SingleDatePicker
							id={'endTime'}
							displayFormat={MomentDateFormat}
							date={moment(endTime)}
							onDateChange={(md) => setEndTime(md?.toDate() ?? endTime)}
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
			<Box mt={4}>
				<Input
					name={'comment'}
					placeholder={'Write a comment..'}
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
			</Box>
			<FormActions
				submitDisabled={false}
				onSubmit={() => update()}
				submitText={'Change'}
				onCancel={() => closeModal()}
				cancelText={'Close'}
				style={{ paddingBottom: 0 }}
			/>
		</Modal>
	);
};
