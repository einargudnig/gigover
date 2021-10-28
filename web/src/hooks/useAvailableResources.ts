import { useMemo } from 'react';
import { Resource, ResourceStatus } from '../models/Resource';

export const useAvailableResources = (resources: Resource[] = []) => {
	return useMemo(() => {
		return resources.filter((r) => r.status === ResourceStatus.Available);
	}, [resources]);
};
