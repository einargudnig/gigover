import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ApiService } from '../services/ApiService';

export interface ResourceResponse {
	resources: Resource[];
}

export const useResources = () => {
	const { data, isLoading, isError, error, ...rest } = useQuery<ResourceResponse, ErrorResponse>({
		queryKey: [ApiService.resources]
	});

	return {
		data: data?.resources || [],
		isLoading,
		isError,
		error,
		...rest
	};
};
