import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

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

export const useAddTender = (
	options?: UseMutationOptions<number, ErrorResponse, TenderFormData>
) => {
	return useMutation<number, ErrorResponse, TenderFormData>(async (variables) => {
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
			if (error) {
				const axiosError = error as AxiosError<ErrorResponse>;
				devError('Axios error:', axiosError.response?.data);
				throw {
					message: 'Could not add tender',
					errorCode: axiosError.response?.data?.errorCode || 'UNKNOWN_ERROR'
				};
			}

			devError('Unknown error:', error);
			throw {
				message: 'An unexpected error occurred',
				errorCode: 'UNKNOWN_ERROR'
			};
		}
	}, options);
};
