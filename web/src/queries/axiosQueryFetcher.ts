import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const axiosQueryFetcher = async ({ queryKey }: { queryKey: string }) => {
	const { data } = await axios.get(queryKey, {
		withCredentials: true
	});

	return data;
};
