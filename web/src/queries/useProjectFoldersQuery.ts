import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ProjectFolder } from '../models/ProjectFolder';
import { AxiosError } from 'axios';

interface ProjectFolderResponse {
	folders: ProjectFolder[];
}

export const useProjectFoldersQuery = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<ProjectFolderResponse, AxiosError>(
		ApiService.folderList(projectId)
	);

	return {
		data: (data && data.folders) || [],
		isLoading,
		isError,
		error
	};
};
