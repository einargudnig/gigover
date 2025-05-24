import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';
import { ApiService } from '../services/ApiService';

interface FolderFilesResponse {
	projectDocuments: ProjectImage[];
}

export const useFolderDocuments = (projectId: number, folderId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>({
		queryKey: [ApiService.folderFiles(folderId)],
		enabled: !!folderId
	});

	return {
		data: (data && data.projectDocuments) || [],
		isLoading,
		isError,
		error
	};
};
