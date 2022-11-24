// import { Tender } from '../models/Tender';
import axios, { AxiosError } from 'axios';
import { ApiService } from '../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../utils/ConsoleUtils';

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

export const useAddTender = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, TenderFormData>(async (variables) => {
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
