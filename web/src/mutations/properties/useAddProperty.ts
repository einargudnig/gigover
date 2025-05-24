import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface PropertyFormData {
	name: string;
	address: string;
	zipCode: string;
	city: string;
	country: string;
	size: number;
	type: string;
}

export const useAddProperty = () => {
	const client = useQueryClient();

	return useMutation<unknown, ErrorResponse, PropertyFormData>({
		mutationFn: async (variables) => {
			console.log('variables in useAddProperty custom hook', variables);
			try {
				const response = await axios.post(ApiService.addProperty, variables, {
					withCredentials: true
				});
				console.log('response in useAddProperty custom hook', response.data);
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (data, variables) => {
			await client.refetchQueries({ queryKey: [ApiService.getProperties] });
		}
	});
};
