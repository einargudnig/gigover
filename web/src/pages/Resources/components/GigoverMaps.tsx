import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import React, { useState } from 'react';
import { Resource } from '../../../models/Resource';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

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
					resourcesWithGpsCoord.map((r, rIdx) => {
						const [isOpen, setIsOpen] = useState(false);

						return (
							<Marker
								position={findLastPos(r)}
								key={rIdx}
								onClick={() => setIsOpen(!isOpen)}
								icon={{
									url: '/img/MarkPin2.svg',
									// @ts-ignore
									anchor: new google.maps.Point(16, 32)
								}}
							>
								{isOpen && (
									<InfoBox
										onCloseClick={() => setIsOpen(!isOpen)}
										options={{ closeBoxURL: '', enableEventPropagation: true }}
									>
										<div
											style={{
												backgroundColor: '#fff',
												opacity: 0.75,
												padding: '12px'
											}}
										>
											<div style={{ fontSize: '16px', color: '#08233B' }}>
												{r.name}
											</div>
										</div>
									</InfoBox>
								)}
							</Marker>
						);
					})}
			</GoogleMap>
		);
	})
);
export default GigoverMaps;
