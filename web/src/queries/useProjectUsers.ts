import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';

interface ProjectUsersResponse extends ErrorResponse {}

export const useProjectUsers = (projectId: number) => {
	return useQuery<ProjectUsersResponse>(ApiService.projectUsers(projectId));
};
