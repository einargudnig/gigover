import React, { useState } from 'react';
import { Resource } from '../../../models/Resource';
import { Marker, OverlayView } from 'react-google-maps';
// import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

export interface GigoverPinProps {
	resource: Resource;
}

export const GigoverPin = ({ resource }: GigoverPinProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const position = {
		lat: resource.startLat || 0,
		lng: resource.startLng || 0
	};

	return (
		<>
			<Marker
				position={position}
				onClick={() => setIsOpen(!isOpen)}
				icon={{
					url: '/img/MarkPin2.svg',
					// @ts-ignore
					anchor: new google.maps.Point(16, 32)
				}}
			/>
			{isOpen && (
				<OverlayView
					position={position}
					mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
					getPixelPositionOffset={(width, height) => ({
						x: -(width / 2),
						y: -height
					})}
				>
					<div
						style={{
							backgroundColor: '#fff',
							opacity: 1,
							padding: '12px',
							cursor: 'pointer'
						}}
						onClick={() => setIsOpen(!isOpen)}
					>
						<div style={{ fontSize: '16px', color: '#08233B' }}>{resource.name}</div>
					</div>
				</OverlayView>
				// <InfoBox
				// 	onCloseClick={() => setIsOpen(!isOpen)}
				// 	options={{ closeBoxURL: '', enableEventPropagation: true }}
				// >
				// 	<div style={{ backgroundColor: '#fff', opacity: 1, padding: '12px' }}>
				// 		<div style={{ fontSize: '16px', color: '#08233B' }}>
				// 			{resource.name}
				// 		</div>
				// 	</div>
				// </InfoBox>
			)}
		</>
	);
};
