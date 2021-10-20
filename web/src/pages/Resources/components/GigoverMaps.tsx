import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import React from 'react';
import { Resource } from '../../../models/Resource';

interface GigoverMapsWithResources {
	resources?: Resource[];
}

const GigoverMaps = withScriptjs(
	withGoogleMap(({ resources = [] }: GigoverMapsWithResources) => {
		const defaultCenter = { lat: 64.13548, lng: -21.89541 };
		const resourcesWithGpsCoord = resources.filter(
			(q) => (q.startLat && q.startLng) || (q.stopLat && q.stopLng)
		);

		const findLastPos = (
			resource: Resource
		): {
			lng: number;
			lat: number;
		} => {
			return {
				lng: resource.stopLng || resource.startLng || 0,
				lat: resource.stopLat || resource.startLat || 0
			};
		};
		return (
			<GoogleMap defaultZoom={8} defaultCenter={defaultCenter}>
				{resourcesWithGpsCoord.length > 0 &&
					resourcesWithGpsCoord.map((r, rIdx) => (
						<Marker position={findLastPos(r)} key={rIdx} />
					))}
			</GoogleMap>
		);
	})
);

export default GigoverMaps;
