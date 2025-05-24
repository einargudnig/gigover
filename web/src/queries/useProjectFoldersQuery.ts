import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ProjectFolder } from '../models/ProjectFolder';
import { ApiService } from '../services/ApiService';

interface ProjectFolderResponse {
	folders: ProjectFolder[];
}

export const useProjectFoldersQuery = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<ProjectFolderResponse, AxiosError>({
		queryKey: [ApiService.folderList(projectId)]
	});

	return {
		data: (data && data.folders) || [],
		isLoading,
		isError,
		error
	};
};
