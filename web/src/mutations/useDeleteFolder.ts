import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import { devError } from '../utils/ConsoleUtils';
import { ApiService } from '../services/ApiService';
import { ProjectFolder } from '../models/ProjectFolder';

interface FolderInput extends Pick<ProjectFolder, 'projectId' | 'name'> {
	folderId?: number;
}

export const useDeleteFolder = () => {
	const client = useQueryClient();

	return useMutation<ProjectFolder, AxiosError, FolderInput>(async (variables) => {
		try {
			const response = await axios.post<ProjectFolder>(ApiService.deleteFolder, variables, {
				withCredentials: true
			});

			if (response.status === 200) {
				// Refetch the new folder list after creation
				await client.refetchQueries(ApiService.folderList(variables.projectId));
			}
			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not create folder');
		}
	});
};
