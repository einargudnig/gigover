import React from 'react';
import { Task, TaskStatus, TaskStatusType } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { HStack, Tag } from '@chakra-ui/react';

interface WorkerAssigneUpdateProps {
	projectId: number;
	task: Task;
}

export const WorkerAssigneUpdate = ({ task, projectId }: WorkerAssigneUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

	const updateWorker = async (workerId: string) => {
		await updateTask({
			taskId: task.taskId,
			typeId: task.typeId,
			text: task.text,
			status: task.status,
			workerId: workerId,
			comment: ''
		});
	};

	return (
		<div style={{ width: '100%' }}>
			<HStack mb={4} spacing={4} justifyContent={'space-between'}>
				<Tag>Worker assigne</Tag>
				{isLoading && <LoadingSpinner />}
			</HStack>
			<TrackerSelect
				title={'Worker'}
				value={task.worker?.uId}
				options={[
					{ value: 29, label: 'Jonas' },
					{ value: 24, label: 'Fridrik' },
					{ value: 43, label: 'Gummi' },
					{ value: 52, label: 'oli' }
				]}
				valueChanged={(newValue) => updateWorker(newValue as string)}
			/>
		</div>
	);
};
