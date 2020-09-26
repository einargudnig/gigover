import { Project } from '../models/Project';
import { useMutation } from 'react-query';
import { ProjectResponse } from './useProjectList';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';

export interface ProjectFormData extends Pick<Project, 'name' | 'description' | 'status'> {
	projectId?: number;
}

export const useModifyProject = () =>
	useMutation<ProjectResponse, ErrorResponse, ProjectFormData>(
		async (project) =>
			await axios.post(ApiService.modifyProject, project, { withCredentials: true })
	);
