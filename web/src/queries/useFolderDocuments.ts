import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ProjectFile } from '../models/ProjectFile';
import { ApiService } from '../services/ApiService';

interface FolderFilesResponse {
	projectDocuments: ProjectFile[];
}

export const useFolderDocuments = (folderId: number) => {
	const { data, isPending, isError, error } = useQuery<FolderFilesResponse, AxiosError>({
		queryKey: [ApiService.folderFiles(folderId)],
		queryFn: async () => {
			const response = await axios.get(ApiService.folderFiles(folderId), {
				withCredentials: true
			});
			return response.data;
		},
		enabled: !!folderId
	});

	return {
		data: (data && data.projectDocuments) || [],
		isPending,
		isError,
		error
	};
};
