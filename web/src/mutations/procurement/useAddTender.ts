import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface TenderFormData {
	projectId: number;
	projectName: string;
	taskId: number;
	description: string;
	terms: string;
	finishDate: number;
	delivery: number;
	address: string;
	phoneNumber: string;
}

interface TenderCreateResponse {
	id: number;
	errorCode?: string;
}

export const useAddTender = (options?: UseMutationOptions<number, Error, TenderFormData>) => {
	return useMutation<number, Error, TenderFormData>({
		mutationKey: [ApiService.addTender],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post<TenderCreateResponse>(
					ApiService.addTender,
					variables,
					{
						withCredentials: true
					}
				);

				if (response.data.errorCode) {
					throw new Error(response.data.errorCode);
				}

				return response.data.id;
			} catch (error) {
				devError('Error in useAddTender:', error);
				throw error;
			}
		},
		...(options || {})
	});
};
