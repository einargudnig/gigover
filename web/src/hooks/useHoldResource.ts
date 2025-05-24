import { Resource } from '../models/Resource';
import { useHoldResource } from '../mutations/useHoldResource';
import { useGetLocation } from './useGetLocation';

export const useHoldResourceButton = () => {
	const holdResource = useHoldResource();
	const location = useGetLocation();

	return {
		isPending: location.loading || holdResource.isPending,
		execute: async (resource: Resource, projectId?: number, taskId?: number) => {
			let gps: GeolocationPosition | null = null;
			try {
				gps = await location.getPosition();
			} catch (e) {
				console.info('Could not get GeoLocation', e);
			}

			await holdResource.mutateAsync({
				...resource,
				startLat: gps?.coords.latitude,
				startLng: gps?.coords.longitude,
				projectId,
				taskId
			});
		}
	};
};
