import { Button } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { useAvailableResources } from '../../../hooks/useAvailableResources';
import { useHoldResourceButton } from '../../../hooks/useHoldResource';
import { Task } from '../../../models/Task';
import { useResources } from '../../../queries/useResources';
import { devError } from '../../../utils/ConsoleUtils';
import { LoadingSpinner } from '../../LoadingSpinner';
import { TrackerSelect } from '../../TrackerSelect';
import { ResourceOnTask } from './ResourceOnTask';

export interface UseResourceOnTaskProps {
	task: Task;
}

export const UseResourceOnTask = ({ task }: UseResourceOnTaskProps): JSX.Element => {
	const { data: resourceList, isLoading } = useResources();
	const [selectedResource, setSelectedResource] = useState<number | undefined>();
	const holdResource = useHoldResourceButton();
	const availableResources = useAvailableResources(resourceList ?? []);

	const resourcesOnTask = useMemo(() => {
		return resourceList.filter(
			(r) => r.projectId === task.projectId && r.taskId === task.taskId
		);
	}, [resourceList, task]);

	const hold = useCallback(async () => {
		try {
			if (!selectedResource || selectedResource === 0) {
				alert('You have to select a resource first.');
			} else {
				const resource = resourceList.find((r) => r.id === selectedResource);
				if (resource) {
					await holdResource.execute(resource, task.projectId, task.taskId);
				} else {
					throw new Error('Invalid resource selection.');
				}
			}
		} catch (e) {
			devError(e);
		}
	}, [selectedResource, resourceList, holdResource, task.projectId, task.taskId]);

	return isLoading ? (
		<LoadingSpinner />
	) : (
		<>
			{resourcesOnTask.length > 0 ? (
				<div style={{ width: '100%' }}>
					{resourcesOnTask.map((rt, rtIndex) => (
						<ResourceOnTask resource={rt} task={task} key={rtIndex} />
					))}
				</div>
			) : (
				<>
					<div style={{ flex: 1 }}>
						<TrackerSelect
							title={'Select a resource'}
							value={selectedResource}
							placeholder={
								availableResources.length === 0
									? 'No available resources'
									: 'Click to select'
							}
							options={availableResources.map((res) => ({
								label: res.name,
								value: res.id!
							}))}
							isNumber={true}
							valueChanged={(newValue) => {
								if (newValue === '' || !newValue) {
									setSelectedResource(undefined);
								} else {
									setSelectedResource(newValue as number);
								}
							}}
						/>
					</div>
					<Button
						colorScheme={'yellow'}
						style={{ height: '78px' }}
						onClick={hold}
						isLoading={holdResource.isLoading}
						disabled={availableResources.length === 0 || holdResource.isLoading}
					>
						Hold
					</Button>
				</>
			)}
		</>
	);
};
