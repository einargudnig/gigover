import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface UnitFormData {
	unitId: number;
	name: string;
	size: number;
	type: string;
	propertyId: number;
}

export const useEditUnit = () => {
	const client = useQueryClient();

	return useMutation<unknown, ErrorResponse, UnitFormData>({
		mutationKey: [ApiService.editUnit],
		mutationFn: async (variables) => {
			console.log('variables', variables);
			try {
				const response = await axios.post(ApiService.editUnit, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				devError(e);
				throw e; // Re-throw for TanStack Query
			}
		},
		onSuccess: async (data, variables) => {
			await client.invalidateQueries({
				queryKey: [ApiService.getPropertyById(variables.propertyId)]
			});
		}
	});
};
