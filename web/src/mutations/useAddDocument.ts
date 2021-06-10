import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { ProjectImage } from '../models/ProjectImage';

export interface DocumentInput
	extends Pick<ProjectImage, 'projectId' | 'folderId' | 'name' | 'type' | 'url'> {}

export const useAddDocument = () => {
	const client = useQueryClient();

	return useMutation<ProjectImage, AxiosError, DocumentInput>(async (variables) => {
		try {
			const response = await axios.post<ProjectImage>(ApiService.addImage, variables, {
				withCredentials: true
			});

			if (variables.folderId) {
				console.log(
					'Refetching FolderFilesQueryKey',
					ApiService.folderFiles(variables.folderId)
				);
				await client.refetchQueries(ApiService.folderFiles(variables.folderId));
			}

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not upload image');
		}
	});
};
