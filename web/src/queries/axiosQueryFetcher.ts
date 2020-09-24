import axios from 'axios';

export const axiosQueryFetcher = async (url: string) => {
	const { data } = await axios.get(url, {
		withCredentials: true
	});
	return data;
};
