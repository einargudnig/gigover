import React, { useCallback } from 'react';
import { TaskCardInput } from '../../TaskCardInput';
import { Task, TaskStatus } from '../../../models/Task';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { Divider } from '../../Divider';
import { Button } from '../../forms/Button';

interface UpdateTaskComponentProps {
	task: Task;
	projectId: number;

	onClose(closeModal: boolean): void;
}

export const UpdateTaskComponent = ({
	task,
	projectId,
	onClose
}: UpdateTaskComponentProps): JSX.Element => {
	const [updateTask, { isLoading, error }] = useUpdateTask(projectId);

	const archiveTask = async () => {
		await updateTask({
			taskId: task.taskId,
			typeId: task.typeId,
			text: task.text,
			status: TaskStatus.Archived
		});

		onClose(true);
	};

	const submitChanges = useCallback(
		async (newValue: Pick<Task, 'text' | 'typeId'>) => {
			await updateTask({
				status: task.status,
				taskId: task.taskId,
				typeId: newValue.typeId,
				text: newValue.text
			});

			onClose(true);
		},
		[task, updateTask]
	);

	return (
		<>
			<div>
				<h3>Task details</h3>
				<TaskCardInput
					value={task.text}
					error={error?.errorText}
					loading={isLoading}
					onSubmit={(newValue: Pick<Task, 'text' | 'typeId'>) => submitChanges(newValue)}
				/>
			</div>
			<Divider />
			<div>
				<h3>Archive Task</h3>
				<Button onClick={() => archiveTask()} appearance={'delete'} size={'none'}>
					Archive this task
				</Button>
			</div>
			<Divider />
			<div>
				<h3>Discard changes</h3>
				<Button onClick={() => onClose(false)} appearance={'lightblue'}>
					Cancel & close
				</Button>
			</div>
		</>
	);
};
