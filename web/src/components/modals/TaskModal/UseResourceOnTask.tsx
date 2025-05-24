import { Button, Select, VStack } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { ResourceStatus } from '../../../models/Resource';
import { Task } from '../../../models/Task';
import { useHoldResource } from '../../../mutations/useHoldResource';
import { useResources } from '../../../queries/useResources';
import { LoadingSpinner } from '../../LoadingSpinner';

export interface UseResourceOnTaskProps {
	task: Task;
}

export const UseResourceOnTask = ({ task }: UseResourceOnTaskProps): JSX.Element => {
	const { data: resourceList, isPending } = useResources();
	const [selectedResource, setSelectedResource] = useState<string>('');
	const holdResource = useHoldResource();

	const handleHoldResource = useCallback(async () => {
		if (selectedResource) {
			const resource = resourceList?.find((r) => r.id === Number(selectedResource));
			if (resource) {
				await holdResource.mutateAsync({
					...resource,
					projectId: task.projectId,
					taskId: task.taskId
				});
			}
		}
	}, [selectedResource, resourceList, holdResource, task.projectId, task.taskId]);

	const availableResources = useMemo(() => {
		if (!resourceList) {
			return [];
		}
		return resourceList.filter((r) => r.status === ResourceStatus.Available && !r.taskId);
	}, [resourceList]);

	return isPending ? (
		<LoadingSpinner />
	) : (
		<VStack>
			<Select
				placeholder="Select resource"
				value={selectedResource}
				onChange={(e) => setSelectedResource(e.target.value)}
			>
				{availableResources.map((r) => (
					<option key={r.id} value={r.id}>
						{r.name}
					</option>
				))}
			</Select>
			<Button
				colorScheme="green"
				onClick={handleHoldResource}
				isLoading={holdResource.isPending}
				disabled={
					availableResources.length === 0 || holdResource.isPending || !selectedResource
				}
			>
				Hold resource
			</Button>
		</VStack>
	);
};
