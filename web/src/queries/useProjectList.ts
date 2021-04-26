import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { Project } from '../models/Project';
import { ErrorResponse } from '../models/ErrorResponse';
import { useFileService } from '../hooks/useFileService';
import { useMemo, useState } from 'react';
import { ProjectFile } from '../models/ProjectFile';
import { FileDocument } from '../services/FileSystemService';

export interface ProjectResponse {
	projects: Project[];
}

export const useProjectList = (fetchRecentFiles?: boolean) => {
	const { fileService } = useFileService();
	const [loadingFiles, setLoadingFiles] = useState(false);
	const { data, isLoading, isError, error } = useQuery<ProjectResponse, ErrorResponse>(
		ApiService.projectList,
		{
			refetchOnWindowFocus: true
		}
	);

	// Fetch recent files if flag is set
	const files: ProjectFile[] = useMemo(() => {
		if (fetchRecentFiles && !isLoading && data && data.projects) {
			setLoadingFiles(true);
			const promises: Promise<firebase.database.DataSnapshot>[] = [];

			data.projects.forEach((p) => {
				const promise = fileService.getProjectFilesQuery(p.projectId, 5).once('value');

				promise.then((snapshot) => {
					if (snapshot.val() !== null) {
						const map = Object.entries<FileDocument>(snapshot.val());

						map.forEach(([, value]) => {
							// TODO Look at this.
							// Strange that I can directly add this to the memoized value, but its working..
							files.push(new ProjectFile(value));
						});
					}
				});

				promises.push(promise);
			});

			Promise.all(promises).finally(() => setLoadingFiles(false));
		}

		return [];
	}, [fetchRecentFiles, isLoading, data, fileService]);

	return {
		data,
		isLoading,
		isError,
		error,
		loadingFiles,
		files: files
	};
};
