import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { ResourceCategory } from '../models/Resource';

interface ResourceCategoriesResponse {
	categories: ResourceCategory[];
}

export const useResourceCategories = () =>
	useQuery<ResourceCategoriesResponse, ErrorResponse>(ApiService.resourceCategories, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
