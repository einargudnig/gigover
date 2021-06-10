import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { devError } from '../utils/ConsoleUtils';
import { ApiService } from '../services/ApiService';
import { ProjectFolder } from '../models/ProjectFolder';

interface FolderInput extends Pick<ProjectFolder, 'projectId' | 'name'> {
	folderId?: number;
}

export const useAddFolder = () => {
	return useMutation<ProjectFolder, AxiosError, FolderInput>(async (variables) => {
		try {
			const response = await axios.post<ProjectFolder>(ApiService.addFolder, variables, {
				withCredentials: true
			});
			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not create folder');
		}
	});
};
