import React from 'react';
import styled from 'styled-components';
import { Task, TaskStatus, TaskStatusType } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { Button } from '../../forms/Button';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';

interface StatusUpdateProps {
	task: Task;
}

const StatusUpdateStyled = styled.div``;

export const StatusUpdate = ({ task }: StatusUpdateProps): JSX.Element => {
	const [modifyTask, { isLoading, isError, error }] = useUpdateTask(task.projectId);

	const updateTaskStatus = async (status: TaskStatusType) => {
		await modifyTask({
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
				value={Object.keys(TaskStatus)[task.status] || 'Unknown'}
				valueChanged={(newValue: string) => null}
			/>
			<Button onClick={() => updateTaskStatus(TaskStatus.Done)}>Test</Button>
		</StatusUpdateStyled>
	);
};
