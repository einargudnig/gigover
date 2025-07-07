import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ResourceType } from '../models/Resource';
import { ApiService } from '../services/ApiService';

interface ResourceTypesResponse {
	areas: ResourceType[];
}

export const useResourceTypes = () =>
	useQuery<ResourceTypesResponse, ErrorResponse>({
		queryKey: [ApiService.resourceTypes],
		refetchOnWindowFocus: false
	});
