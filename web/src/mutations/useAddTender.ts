// import { Tender } from '../models/Tender';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { ErrorResponse } from '../models/ErrorResponse';

// interface OptionalProjectId {
// 	projectId?: number;
// }

export interface TenderFormData {
	projectId?: number;
	taskId?: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: string;
	address: string;
	phoneNumber: string;
}

// Sometime we might want to close the tender?
// if so we might need to add a status field to the TenderFormData interface

// this will be for the Tender itself, this will have more of the information regaarding the tender.
// we will have tenderitem which will have more info about the individual items.
export const useAddTender = () => {
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
			// ! For some reason I *always* get an error here when posting,
			// I need to make sure the db is working correctly. So that I know the issue is on my end
			throw new Error('Could not add tender');
		}
	});
};
