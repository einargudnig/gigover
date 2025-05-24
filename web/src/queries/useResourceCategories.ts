import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ResourceCategory } from '../models/Resource';
import { ApiService } from '../services/ApiService';

interface ResourceCategoriesResponse {
	categories: ResourceCategory[];
}

export const useResourceCategories = () =>
	useQuery<ResourceCategoriesResponse, ErrorResponse>({
		queryKey: [ApiService.resourceCategories],
		refetchOnWindowFocus: false
	});
