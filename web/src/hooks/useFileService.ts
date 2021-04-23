import { useContext } from 'react';
import { FileSystemService, FolderResult } from '../services/FileSystemService';
import { FileSystemContext } from '../context/FileSystemContext';

interface IFileService {
	fileService: FileSystemService;
	getFilesForProjects: (projectIds: number[]) => Promise<FolderResult[]>;
	getFilesForProject: (projectId: number) => Promise<FolderResult>;
}

export const useFileService = (): IFileService => {
	const fileService = useContext(FileSystemContext);

	const getFilesForProject = (projectId: number) => fileService.getProjectFiles(projectId);

	const getFilesForProjects = (projectIds: number[]) => {
		// Fetch all
		const promises: Promise<FolderResult>[] = [];

		projectIds.forEach((id) => {
			promises.push(getFilesForProject(id));
		});

		return Promise.all(promises);
	};

	return {
		fileService,
		getFilesForProjects,
		getFilesForProject
	};
};
