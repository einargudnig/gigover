import React, { useCallback } from 'react';
import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Tag
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../../forms/DatePicker';
import { ProjectTask } from '../../../queries/useTaskDetails';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { LoadingSpinner } from '../../LoadingSpinner';

interface TaskDateChangerProps {
	task: ProjectTask;
}

export const TaskDateChanger = ({ task }: TaskDateChangerProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(task.project.projectId);
	const { getValues, control, errors } = useForm<Pick<ProjectTask, 'startDate' | 'endDate'>>({
		defaultValues: {
			startDate: task.startDate,
			endDate: task.endDate
		}
	});

	const updateDates = useCallback(() => {
		const { startDate, endDate } = getValues(['startDate', 'endDate']);

		updateTask({
			taskId: task.taskId,
			typeId: task.typeId,
			text: task.text,
			status: task.status,
			startDate: startDate,
			endDate: endDate,
			comment: ''
		});
	}, [updateTask, task, getValues]);

	return (
		<div style={{ width: '100%' }}>
			<HStack justifyContent={'space-between'} mb={4}>
				<Tag>Task deadline</Tag>
				{isLoading && <LoadingSpinner />}
			</HStack>
			<FormControl isInvalid={true}>
				<FormLabel htmlFor="startDate">Start and end date</FormLabel>
				<HStack>
					<Controller
						name="startDate"
						control={control}
						defaultValue={task?.startDate ? new Date(task.startDate) : null}
						render={({ onChange, value, onBlur }) => (
							<DatePicker
								selected={value}
								onChange={(date) => {
									if (date) {
										onChange((date as Date).getTime());
									} else {
										onChange(null);
									}

									updateDates();
								}}
								onBlur={() => {
									onBlur();
								}}
							/>
						)}
					/>
					<Controller
						name="endDate"
						control={control}
						defaultValue={task?.endDate ? new Date(task.endDate) : null}
						render={({ onChange, value, onBlur }) => (
							<DatePicker
								selected={value}
								onChange={(date) => {
									if (date) {
										onChange((date as Date).getTime());
									} else {
										onChange(null);
									}

									updateDates();
								}}
								onBlur={() => {
									onBlur();
								}}
							/>
						)}
					/>
				</HStack>
				{errors.startDate || errors.endDate ? (
					<FormErrorMessage>
						{errors.startDate?.message || errors.endDate?.message}
					</FormErrorMessage>
				) : (
					<FormHelperText>
						When is the estimated start and end date of this project task?
					</FormHelperText>
				)}
			</FormControl>
		</div>
	);
};
