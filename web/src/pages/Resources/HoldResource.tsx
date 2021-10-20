import React from 'react';
import { Button } from '@chakra-ui/react';
import { Resource } from '../../models/Resource';
import { useHoldResource } from '../../mutations/useHoldResource';
import { useReleaseResource } from '../../mutations/useReleaseResource';
import { useGetLocation } from '../../hooks/useGetLocation';

export interface HoldResourceProps {
	resource: Resource;
}

export const HoldResource = ({ resource }: HoldResourceProps): JSX.Element => {
	const location = useGetLocation();
	const { mutateAsync: holdResource, isLoading: isHoldLoading } = useHoldResource();
	const { mutateAsync: releaseResource, isLoading: isReleaseLoading } = useReleaseResource();

	const isAvailable = resource.status === 0;

	const holdOrReleaseResource = async (type: 'hold' | 'release') => {
		let gps: GeolocationPosition | null = null;
		try {
			gps = await location.getPosition();
		} catch (e) {
			console.info('Could not get GeoLocation', e);
		}

		if (type === 'hold') {
			await holdResource({
				...resource,
				startLat: gps?.coords.latitude,
				startLng: gps?.coords.longitude
			});
		} else {
			await releaseResource({
				...resource,
				stopLat: gps?.coords.latitude,
				stopLng: gps?.coords.longitude
			});
		}
	};

	return (
		<>
			{isAvailable ? (
				<Button
					isLoading={location.loading || isHoldLoading}
					onClick={() => holdOrReleaseResource('hold')}
				>
					Use
				</Button>
			) : (
				<Button
					isLoading={location.loading || isReleaseLoading}
					onClick={() => holdOrReleaseResource('release')}
				>
					Stop using
				</Button>
			)}
		</>
	);
};
