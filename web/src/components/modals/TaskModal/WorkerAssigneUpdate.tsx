import { HStack, Tag } from '@chakra-ui/react';
import { WorkerItem } from '../../../models/Project';
import { Task } from '../../../models/Task';
import { useUpdateTask } from '../../../queries/useUpdateTask';
import { LoadingSpinner } from '../../LoadingSpinner';
import { TrackerSelect } from '../../TrackerSelect';

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
		await updateTask({
			...task,
			worker: { uId: workerId }
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
