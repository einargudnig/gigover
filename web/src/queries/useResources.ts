import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { Resource } from '../models/Resource';

export interface ResourceResponse {
	resources: Resource[];
}

export const useResources = () => {
	const { data, isLoading, isError, error, ...rest } = useQuery<
		ResourceResponse,
		ErrorResponse,
		ResourceResponse
	>(ApiService.resources, {
		refetchOnWindowFocus: true
	});

	return {
		data: data?.resources || [],
		isLoading,
		isError,
		error,
		...rest
	};
};
