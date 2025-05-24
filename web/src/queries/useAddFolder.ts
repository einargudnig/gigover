import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ProjectFolder } from '../models/ProjectFolder';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

interface FolderInput extends Pick<ProjectFolder, 'projectId' | 'name'> {
	folderId?: number;
}

export const useAddFolder = () => {
	const client = useQueryClient();

	return useMutation<ProjectFolder & { id?: number }, AxiosError, FolderInput>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<ProjectFolder & { id?: number }>(
					ApiService.addFolder,
					{ ...variables, parentId: variables.folderId ?? 0 },
					{
						withCredentials: true
					}
				);

				if (response.status === 200) {
					// Refetch the new folder list after creation
					if (variables.folderId) {
						await client.refetchQueries({
							queryKey: [
								ApiService.folderFolders(variables.projectId, variables.folderId)
							]
						});
					} else {
						await client.refetchQueries({
							queryKey: [ApiService.folderList(variables.projectId)]
						});
					}
				}

				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not create folder');
			}
		}
	});
};
