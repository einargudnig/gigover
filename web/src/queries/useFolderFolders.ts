import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';

interface FolderFilesResponse {
	folders: ProjectImage[];
}

export const useFolderFolders = (projectId: number, folderId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>(
		ApiService.folderFolders(projectId, folderId)
	);

	return {
		data: (data && data.folders) || [],
		isLoading,
		isError,
		error
	};
};
