import { useQuery } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

export interface ResourceComment {
	comment: string;
	fullName: string;
	resourceId: number;
	sent: number;
}

export interface ResourceCommentsResponse {
	resources: ResourceComment[];
}

export const useResourceComments = (resourceId: number) =>
	useQuery<ResourceCommentsResponse, ErrorResponse>(ApiService.getResourceComments(resourceId), {
		refetchOnWindowFocus: true
	});
