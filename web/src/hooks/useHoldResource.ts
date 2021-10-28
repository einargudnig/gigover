import { useHoldResource } from '../mutations/useHoldResource';
import { useGetLocation } from './useGetLocation';
import { Resource } from '../models/Resource';

export const useHoldResourceButton = () => {
	const holdResource = useHoldResource();
	const location = useGetLocation();

	return {
		isLoading: location.loading || holdResource.isLoading,
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
