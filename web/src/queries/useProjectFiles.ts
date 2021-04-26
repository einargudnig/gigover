import { ProjectFile } from '../models/ProjectFile';
import { useEffect, useState } from 'react';
import { FileDocument } from '../services/FileSystemService';
import { Project } from '../models/Project';
import { useFileService } from '../hooks/useFileService';

export const useProjectFiles = () => {
	const { fileService } = useFileService();
	const [project, setProject] = useState<Project | null>(null);
	const [loadingFiles, setLoadingFiles] = useState(false);
	const [files, setFiles] = useState<ProjectFile[]>([]);

	// Fetch recent files if flag is set
	useEffect(() => {
		const tempFiles: ProjectFile[] = [];
		if (project) {
			setLoadingFiles(true);
			fileService.getProjectFilesDb(project.projectId, (snapshot) => {
				if (snapshot.val() !== null) {
					const map = Object.entries<FileDocument>(snapshot.val());

					map.forEach(([, value]) => {
						// TODO Look at this.
						// Strange that I can directly add this to the memoized value, but its working..
						tempFiles.push(new ProjectFile(value));
					});
				}

				setLoadingFiles(false);
			});
		}

		setFiles(tempFiles);
	}, [project, fileService]);

	return {
		files,
		setProject,
		loadingFiles
	};
};
