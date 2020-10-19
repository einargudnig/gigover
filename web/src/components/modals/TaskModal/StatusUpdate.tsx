import React from 'react';
import { Task, TaskStatus, TaskStatusType } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

export const StatusUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const [updateTask, { isLoading }] = useUpdateTask(projectId);

	const updateTaskStatus = async (status: TaskStatusType) => {
		await updateTask({
			taskId: task.taskId,
			typeId: task.typeId,
			text: task.text,
			status: status,
			comment: ''
		});
	};

	return (
		<div>
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
				valueChanged={(newValue) => updateTaskStatus(newValue as TaskStatusType)}
			/>
		</div>
	);
};
