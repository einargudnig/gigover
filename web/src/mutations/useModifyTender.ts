// import { Tender } from '../models/Tender';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
// import { Project } from '../models/Project';
import { ErrorResponse } from '../models/ErrorResponse';

// interface OptionalProjectId {
// 	projectId?: number;
// }

export interface TenderFormData {
	projectId: number;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: string;
	address: string;
	phoneNumber: string;
}

// Sometime we might want to close the tender?
// if so we might need to add a status field to the TenderFormData interface
// export interface CloseProjectData extends Pick<Project, 'projectId'> {
// 	status: typeof ProjectStatus.DONE;
// }

export const useModifyTender = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, TenderFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addTender, variables, {
				withCredentials: true
			});

			await client.refetchQueries(ApiService.addTender);

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add tender');
		}
	});
};
