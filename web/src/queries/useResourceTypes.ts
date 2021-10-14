import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { ResourceType } from '../models/Resource';

interface ResourceTypesResponse {
	areas: ResourceType[];
}

export const useResourceTypes = () =>
	useQuery<ResourceTypesResponse, ErrorResponse>(ApiService.resourceTypes, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
