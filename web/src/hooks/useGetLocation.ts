import { useState } from 'react';

export const useGetLocation = () => {
	const [loading, setLoading] = useState(false);

	const getPosition = (): Promise<GeolocationPosition> => {
		setLoading(true);
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						resolve(position);
						setLoading(false);
					},
					(error) => {
						reject(error);
						setLoading(false);
					}
				);
			} else {
				reject('Location not available');
				setLoading(false);
			}
		});
	};

	return {
		loading,
		getPosition
	};
};
