import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

// interface ProjectUsersResponse extends ErrorResponse {} // Removed this unused interface

// Define a proper success response type if possible, e.g.:
// interface User { id: string; name: string; /* ... */ }
// interface ProjectUsersSuccessData { users: User[]; }

// Using unknown for TData for now, ErrorResponse for TError
export const useProjectUsers = (projectId: number) => {
	return useQuery<unknown, ErrorResponse>({
		queryKey: [ApiService.projectUsers(projectId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.projectUsers(projectId), {
				withCredentials: true
			});
			return response.data;
		}
	});
};
