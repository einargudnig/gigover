import { Resource } from '../models/Resource';
import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import { ResourceHistoryItem } from '../models/ResourceHistoryItem';

interface ResourceHistoryResponse {
	resources: ResourceHistoryItem[];
}

export const useResourceHistory = (resource: Resource) =>
	useQuery<ResourceHistoryResponse, ErrorResponse>(ApiService.resourceHistory(resource.id!), {
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
