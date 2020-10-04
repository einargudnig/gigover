import React from 'react';
import styled from 'styled-components';
import { Task, TaskStatus, TaskStatusType } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

const StatusUpdateStyled = styled.div``;

export const StatusUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const [updateTask, { isLoading, isError, error }] = useUpdateTask(projectId);

	const updateTaskStatus = async (status: TaskStatusType) => {
		await updateTask({
			taskId: task.taskId,
			status: status,
			comment: ''
		});
	};

	return (
		<StatusUpdateStyled>
			<h3>Task status {isLoading && <LoadingSpinner />}</h3>
			<TrackerSelect
				title={'Status'}
				value={task.status}
				options={[
					{ value: TaskStatus.Backlog, label: 'Backlog' },
					{ value: TaskStatus.Todo, label: 'Todo' },
					{ value: TaskStatus.Doing, label: 'Doing' },
					{ value: TaskStatus.Done, label: 'Done' }
				]}
				valueChanged={(newValue: number) => updateTaskStatus(newValue as TaskStatusType)}
			/>
		</StatusUpdateStyled>
	);
};
