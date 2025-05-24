import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

export interface ProjectFolder {
	folderId: number;
	projectId: number;
	name: string;
	created: number;
}

interface ProjectFoldersInput {
	projectId: number;
}

export const useProjectFolders = () => {
	return useMutation<ProjectFolder[], AxiosError, ProjectFoldersInput>({
		mutationFn: async ({ projectId }) => {
			try {
				const response = await axios.get<{ folders: ProjectFolder[] }>(
					ApiService.folderList(projectId),
					{
						withCredentials: true
					}
				);
				return response.data.folders;
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	});
};
