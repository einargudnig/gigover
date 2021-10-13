import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';

interface FolderFilesResponse {
	projectDocuments: ProjectImage[];
}

export const useFolderDocuments = (folderId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>(
		ApiService.folderFiles(folderId),
	);

	return {
		data: (data && data.projectDocuments) || [],
		isLoading,
		isError,
		error
	};
};
