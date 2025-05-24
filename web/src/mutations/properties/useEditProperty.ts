import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface PropertyFormData {
	propertyId: number;
	name: string;
	address: string;
	zipCode: string;
	city: string;
	country: string;
	size: number;
	type: string;
}

export const useEditProperty = () => {
	const client = useQueryClient();

	return useMutation<unknown, ErrorResponse, PropertyFormData>({
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.editProperty, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (data, variables) => {
			await client.refetchQueries({
				queryKey: [ApiService.getPropertyById(variables.propertyId)]
			});
		}
	});
};
