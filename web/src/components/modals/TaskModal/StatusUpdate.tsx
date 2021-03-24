import React from 'react';
import { Task, TaskStatus, TaskStatusType } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { HStack, Tag } from '@chakra-ui/react';

interface StatusUpdateProps {
	projectId: number;
	task: Task;
}

export const StatusUpdate = ({ task, projectId }: StatusUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

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
		<div style={{ width: '100%' }}>
			<HStack mb={4} spacing={4} justifyContent={'space-between'}>
				<Tag>Task status</Tag>
				{isLoading && <LoadingSpinner />}
			</HStack>
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
