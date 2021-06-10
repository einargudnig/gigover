import { useMutation } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

interface ProjectFolder {
	folderId: number;
	projectId: number;
	name: string;
	created: number;
}

interface ProjectFoldersInput {
	projectId: number;
}

export const useProjectFolders = () => {
	return useMutation<ProjectFolder[], AxiosError, ProjectFoldersInput>(async ({ projectId }) => {
		try {
			const response = await axios.get(ApiService.folderList(projectId), {
				withCredentials: true
			});
			return response.data.folders;
		} catch (e) {
			devError(e);
			throw new Error('Could not load folders for ' + projectId);
		}
	});
};
