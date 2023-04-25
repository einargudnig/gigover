// import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useState, useEffect } from 'react';
import { Resource } from '../../../models/Resource';
import { GigoverPin } from './GigoverPin';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Center, Box } from '@chakra-ui/react';

interface GigoverMapsWithResources {
	resources?: Resource[];
}

const libraries: ('places' | 'drawing' | 'geometry' | 'localContext' | 'visualization')[] = [
	'places'
];

const defaultCenter = { lat: 64.13548, lng: -21.89541 };

const mapContainerStyle = {
	height: '400px',
	width: '100%'
};

const GigoverMaps = ({ resources }: GigoverMapsWithResources) => {
	const resourcesWithGpsCoord = resources?.filter(
		(q) => (q.startLat && q.startLng) || (q.stopLat && q.stopLng)
	);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
		libraries
	});

	const [map, setMap] = useState<google.maps.Map | null>(null);

	useEffect(() => {
		if (map) {
			map.fitBounds(getBounds(resourcesWithGpsCoord));
		}
	}, [map, resourcesWithGpsCoord]);

	// eslint-disable-next-line
	const getBounds = (resourcesWithGpsCoord?: Resource[]): google.maps.LatLngBounds => {
		const bounds = new window.google.maps.LatLngBounds();
		resourcesWithGpsCoord?.forEach((r) => {
			bounds.extend(new window.google.maps.LatLng(r.startLat || 0, r.startLng || 0));
			bounds.extend(new window.google.maps.LatLng(r.stopLat || 0, r.stopLng || 0));
		});
		return bounds;
	};

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	return isLoaded ? (
		<Box>
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				zoom={8}
				center={defaultCenter}
				onLoad={() => setMap(map)}
			>
				{resourcesWithGpsCoord?.map((r, rIdx) => (
					<Marker
						key={rIdx}
						position={{
							lat: r.startLat || r.stopLat || 0,
							lng: r.startLng || r.stopLng || 0
						}}
					/>
				))}
			</GoogleMap>
		</Box>
	) : (
		<Center h="100%">
			<LoadingSpinner />
		</Center>
	);
};

export default GigoverMaps;
