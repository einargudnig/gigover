import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';

interface FolderFilesResponse {
	files: ProjectImage[];
}

export const useFolderDocuments = (folderId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>(
		ApiService.folderFiles(folderId)
	);

	return {
		data: (data && data.files) || [],
		isLoading,
		isError,
		error
	};
};
