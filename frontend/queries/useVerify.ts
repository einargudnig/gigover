import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

interface VerifyResponse {
	authenticated?: boolean;
}

const url =
	process.env.NODE_ENV === 'production'
		? 'https://rest.gigover.com/rest/user/info'
		: 'http://localhost:8080/rest/user/info';

const gigoverWeb =
	process.env.NODE_ENV === 'production'
		? 'https://web.gigover.com'
		: 'http://local.gigover.com:3000';

export const useVerify = () => {
	const { data, isLoading } = useQuery<any, any, AxiosResponse<VerifyResponse>>(
		'Verify',
		async () => {
			return await axios.get(url, { withCredentials: true });
		},
		{
			retry: false,
			retryOnMount: false
		}
	);

	return {
		isLoading,
		authenticated: data?.data.authenticated || false,
		openProjects: () => {
			window.location.href = gigoverWeb;
		}
	};
};
