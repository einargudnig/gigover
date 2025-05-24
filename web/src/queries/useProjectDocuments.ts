import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
// import { ProjectImage } from '../models/ProjectImage';
import { ProjectFile } from '../models/ProjectFile';

interface FolderFilesResponse {
	projectDocuments: ProjectFile[];
}

export const useProjectDocuments = (projectId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>({
		queryKey: [ApiService.projectFiles(projectId)]
	});

	return {
		data: (data && data.projectDocuments) || [],
		isLoading,
		isError,
		error
	};
};
