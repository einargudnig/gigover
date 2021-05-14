import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

interface VerifyResponse {
	authenticated?: boolean;
}

const url = process.env.NEXT_PUBLIC_GIGOVER_REST_API;
const gigoverWeb = process.env.NEXT_PUBLIC_GIGOVER_URL;

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
