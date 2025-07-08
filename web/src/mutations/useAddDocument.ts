import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ProjectImage } from '../models/ProjectImage';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

export interface DocumentInput
	extends Pick<
		ProjectImage,
		| 'propertyId'
		| 'offerId'
		| 'tenderId'
		| 'projectId'
		| 'type'
		| 'folderId'
		| 'name'
		| 'url'
		| 'bytes'
		| 'taskId'
	> {}

export const useAddDocument = () => {
	const client = useQueryClient();

	return useMutation<{ projectImage: ProjectImage }, AxiosError, DocumentInput>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<{ projectImage: ProjectImage }>(
					ApiService.addImage,
					variables,
					{
						withCredentials: true
					}
				);
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		},
		onSuccess: async (data, variables) => {
			await client.invalidateQueries({ queryKey: [ApiService.projectList] });

			if (variables.folderId) {
				await client.invalidateQueries({
					queryKey: [ApiService.folderFiles(variables.folderId)]
				});
			}
		}
	});
};
