// import { Tender } from '../models/Tender';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../utils/ConsoleUtils';
import { ErrorResponse } from '../models/ErrorResponse';

export interface TenderFormData {
	projectId?: number;
	taskId?: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	phoneNumber: string;
}

// Sometime we might want to close the tender?
// if so we might need to add a status field to the TenderFormData interface
export const useAddTender = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, TenderFormData>(async (variables) => {
		// console.log('VARIABLES', variables);
		try {
			const response = await axios.post(ApiService.addTender, variables, {
				withCredentials: true
			});
			console.log('REsPONSE', response);
			await client.refetchQueries(ApiService.addTender);

			return response.data;
		} catch (e) {
			console.log('IN CATCH BLOCK');
			devError(e);
			// ! For some reason I *always* get an error here when posting,
			throw new Error('Could not add tender'); //! HERE
		}
	});
};
