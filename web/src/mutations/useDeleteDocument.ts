import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import { devError } from '../utils/ConsoleUtils';
import { ApiService } from '../services/ApiService';
import { ProjectImage } from '../models/ProjectImage';

export interface DocumentInput
	extends Pick<ProjectImage, 'projectId' | 'folderId' | 'imageId' | 'taskId'> {}

export const useDeleteDocument = () => {
	const client = useQueryClient();

	return useMutation<ProjectImage, AxiosError, DocumentInput>(async (variables) => {
		try {
			const response = await axios.post<ProjectImage>(ApiService.removeImage, variables, {
				withCredentials: true
			});

			await client.invalidateQueries(ApiService.projectList);

			if (variables.folderId) {
				await client.invalidateQueries(ApiService.folderFiles(variables.folderId));
			}

			if (variables.taskId) {
				await client.invalidateQueries(ApiService.taskDetails(variables.taskId));
			}

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not upload image');
		}
	});
};
