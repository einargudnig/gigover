import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ApiService } from '../services/ApiService';

export interface ResourceResponse {
	resources: Resource[];
}

export const useResources = () => {
	const { data, isPending, isError, error, ...rest } = useQuery<ResourceResponse, ErrorResponse>({
		queryKey: [ApiService.resources],
		queryFn: async () => {
			const response = await axios.get(ApiService.resources, {
				withCredentials: true
			});
			return response.data;
		},
		staleTime: 1000 * 60 * 5 // 5 minutes
	});

	return {
		data: data?.resources || [],
		isPending,
		isError,
		error,
		...rest
	};
};
