import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
// import { ProjectImage } from '../models/ProjectImage';
import { ProjectFile } from '../models/ProjectFile';

interface FolderFilesResponse {
	projectDocuments: ProjectFile[];
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
