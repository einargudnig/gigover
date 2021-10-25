import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import React, { useContext } from 'react';
import { Resource } from '../../../models/Resource';
import { ModalContext } from '../../../context/ModalContext';

interface GigoverMapsWithResources {
	resources?: Resource[];
}

const GigoverMaps = withScriptjs(
	withGoogleMap(({ resources = [] }: GigoverMapsWithResources) => {
		const [, setModalContext] = useContext(ModalContext);
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
				{resourcesWithGpsCoord.map((r, rIdx) => (
					<Marker
						position={findLastPos(r)}
						key={rIdx}
						onClick={() => setModalContext({ resources: { resource: r } })}
						icon={{
							url: '/img/MarkPin2.svg',
							// @ts-ignore
							anchor: new google.maps.Point(16, 32)
						}}
					/>
				))}
			</GoogleMap>
		);
	})
);
export default GigoverMaps;
