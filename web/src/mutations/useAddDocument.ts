import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { ProjectImage } from '../models/ProjectImage';

export interface DocumentInput
	extends Pick<ProjectImage, 'projectId' | 'folderId' | 'name' | 'type' | 'url'> {}

export const useAddDocument = () => {
	return useMutation<ProjectImage, AxiosError, DocumentInput>(async (variables) => {
		try {
			const response = await axios.post<ProjectImage>(ApiService.addImage, variables, {
				withCredentials: true
			});
			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not upload image');
		}
	});
};
