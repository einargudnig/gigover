import React from 'react';
import { Task } from '../../../models/Task';
import { TrackerSelect } from '../../TrackerSelect';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { HStack, Tag } from '@chakra-ui/react';
import { WorkerItem } from '../../../models/Project';

interface WorkerAssigneUpdateProps {
	projectId: number;
	task: Task;
	workers?: WorkerItem[];
}

export const WorkerAssigneUpdate = ({
	task,
	projectId,
	workers
}: WorkerAssigneUpdateProps): JSX.Element => {
	const { mutateAsync: updateTask, isLoading } = useUpdateTask(projectId);

	const updateWorker = async (workerId: string) => {
		console.log(workerId, 'workerId');
		await updateTask({
			...task,
			worker: { uId: workerId }
		});
	};

	console.log(workers, 'workers');
	return (
		<div style={{ width: '100%' }}>
			<HStack mb={4} spacing={4} justifyContent={'space-between'}>
				<Tag>Worker assigne</Tag>
				{isLoading && <LoadingSpinner />}
			</HStack>
			<TrackerSelect
				title={'Worker'}
				value={task.worker?.uId}
				isNumber={false}
				options={
					workers?.map((w) => {
						return {
							value: w.uId,
							label: w.name
						};
					}) ?? []
				}
				valueChanged={(newValue) => updateWorker(newValue as string)}
			/>
		</div>
	);
};
