import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import React from 'react';
import { Resource } from '../../../models/Resource';
import { GigoverPin } from './GigoverPin';

interface GigoverMapsWithResources {
	resources?: Resource[];
}

const GigoverMaps = withScriptjs(
	withGoogleMap(({ resources = [] }: GigoverMapsWithResources) => {
		const defaultCenter = { lat: 64.13548, lng: -21.89541 };
		const resourcesWithGpsCoord = resources.filter(
			(q) => (q.startLat && q.startLng) || (q.stopLat && q.stopLng)
		);

		return (
			<GoogleMap defaultZoom={8} defaultCenter={defaultCenter}>
				{resourcesWithGpsCoord.map((r, rIdx) => (
					<GigoverPin resource={r} key={rIdx} />
				))}
			</GoogleMap>
		);
	})
);

export default GigoverMaps;
