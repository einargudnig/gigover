import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';
import { ApiService } from '../services/ApiService';

interface FolderFilesResponse {
	folders: ProjectImage[];
}

export const useFolderFolders = (projectId: number, folderId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>({
		queryKey: [ApiService.folderFolders(projectId, folderId)]
	});

	return {
		data: (data && data.folders) || [],
		isLoading,
		isError,
		error
	};
};
