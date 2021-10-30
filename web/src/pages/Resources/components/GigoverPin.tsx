import React, { useState } from 'react';
import { Resource } from '../../../models/Resource';
import { Marker } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

export interface GigoverPinProps {
	resource: Resource;
}

export const GigoverPin = ({ resource }: GigoverPinProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Marker
			position={{
				lng: resource.startLng || 0,
				lat: resource.startLat || 0
			}}
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
					<div style={{ backgroundColor: '#fff', opacity: 1, padding: '12px' }}>
						<div style={{ fontSize: '16px', color: '#08233B' }}>{resource.name}</div>
					</div>
				</InfoBox>
			)}
		</Marker>
	);
};
