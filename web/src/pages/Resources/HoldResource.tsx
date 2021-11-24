import React from 'react';
import { Button } from '@chakra-ui/react';
import { Resource } from '../../models/Resource';
import { useReleaseResource } from '../../mutations/useReleaseResource';
import { useGetLocation } from '../../hooks/useGetLocation';
import { useHoldResourceButton } from '../../hooks/useHoldResource';

export interface HoldResourceProps {
	resource: Resource;
	title?: string;
}

export const HoldResource = ({ resource, title = 'Use' }: HoldResourceProps): JSX.Element => {
	const location = useGetLocation();
	const holdResource = useHoldResourceButton();
	const { mutateAsync: releaseResource, isLoading: isReleaseLoading } = useReleaseResource();

	const isAvailable = resource.status === 0;
	const notAvailable = resource.status === 2;

	const holdOrReleaseResource = async (type: 'hold' | 'release') => {
		if (type === 'hold') {
			await holdResource.execute({
				...resource
			});
		} else {
			let gps: GeolocationPosition | null = null;
			try {
				gps = await location.getPosition();
			} catch (e) {
				console.info('Could not get GeoLocation', e);
			}

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
					isLoading={holdResource.isLoading}
					onClick={() => holdOrReleaseResource('hold')}
				>
					{title}
				</Button>
			) : notAvailable ? null : (
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
