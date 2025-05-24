import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ProjectFolder } from '../models/ProjectFolder';
import { ApiService } from '../services/ApiService';

interface ProjectFolderResponse {
	folders: ProjectFolder[];
}

export const useProjectFoldersQuery = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<ProjectFolderResponse, AxiosError>({
		queryKey: [ApiService.folderList(projectId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.folderList(projectId), {
				withCredentials: true
			});
			return response.data;
		}
	});

	return {
		data: (data && data.folders) || [],
		isLoading,
		isError,
		error
	};
};
