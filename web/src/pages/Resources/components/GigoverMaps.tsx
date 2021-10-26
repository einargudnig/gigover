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
					// <Marker
					// 	position={findLastPos(r)}
					// 	key={rIdx}
					// 	onClick={() => setModalContext({ resources: { resource: r } })}
					// 	icon={{
					// 		url: '/img/MarkPin2.svg',
					// 		// @ts-ignore
					// 		anchor: new google.maps.Point(16, 32)
					// 	}}
					// />
				))}
			</GoogleMap>
		);
	})
);

export default GigoverMaps;
