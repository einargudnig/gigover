import axios from 'axios';
import { handleApiError } from '../services/ApiService';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const axiosQueryFetcher = async ({ queryKey }: { queryKey: string }) => {
	try {
		const { data } = await axios.get(queryKey, {
			withCredentials: true
		});

		return data;
	} catch (error) {
		// Forward to our central error handler
		return handleApiError(error, queryKey);
	}
};
