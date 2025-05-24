import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { Resource } from '../models/Resource';
import { ResourceHistoryItem } from '../models/ResourceHistoryItem';
import { ApiService } from '../services/ApiService';

interface ResourceHistoryResponse {
	resources: ResourceHistoryItem[];
}

export const useResourceHistory = (resource: Resource) =>
	useQuery<ResourceHistoryResponse, ErrorResponse>({
		queryKey: [ApiService.resourceHistory(resource.id!)],
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
