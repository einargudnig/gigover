import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';

interface FolderFilesResponse {
	projectDocuments: ProjectImage[];
}

export const useProjectDocuments = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>(
		ApiService.projectFiles(projectId)
	);

	return {
		data: (data && data.projectDocuments) || [],
		isLoading,
		isError,
		error
	};
};
