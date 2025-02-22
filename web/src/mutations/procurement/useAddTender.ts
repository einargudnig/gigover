import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';
import { TenderBase } from '../../models/Tender';

export interface TenderFormData extends Omit<TenderBase, 'tenderId'> {
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

interface TenderResponse {
	data: TenderBase;
	errorCode?: string;
	message?: string;
}

export const useAddTender = (
	options?: UseMutationOptions<TenderBase, ErrorResponse, TenderFormData>
) => {
	return useMutation<TenderBase, ErrorResponse, TenderFormData>(
		async (variables) => {
			try {
				const response: AxiosResponse<TenderResponse> = await axios.post(
					ApiService.addTender,
					variables,
					{
						withCredentials: true
					}
				);

				if (response.data.errorCode) {
					throw new Error(response.data.errorCode);
				}

				return response.data.data;
			} catch (error) {
				// In Axios 0.20.0, we check for axios errors differently
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
		},
		{
			...options,
			onError: (error, variables, context) => {
				devError('Mutation error:', error);
				options?.onError?.(error, variables, context);
			}
		}
	);
};
