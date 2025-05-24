import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

export interface DocumentInput
	extends Pick<ProjectImage, 'projectId' | 'folderId' | 'imageId' | 'taskId'> {}

export const useDeleteDocument = () => {
	const client = useQueryClient();

	return useMutation<ProjectImage, AxiosError, DocumentInput>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<ProjectImage>(ApiService.removeImage, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (data, variables) => {
			await client.invalidateQueries({ queryKey: [ApiService.projectList] });

			if (variables.folderId) {
				await client.invalidateQueries({
					queryKey: [ApiService.folderFiles(variables.folderId)]
				});
			}

			if (variables.taskId) {
				await client.invalidateQueries({
					queryKey: [ApiService.taskDetails(variables.taskId)]
				});
			}
		}
	});
};
