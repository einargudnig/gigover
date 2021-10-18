export const useGetLocation = () => {
	return (): Promise<GeolocationPosition> => {
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						resolve(position);
					},
					(error) => {
						reject(error);
					}
				);
			} else {
				reject('Location not available');
			}
		});
	};
};
