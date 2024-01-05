import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface UnitFormData {
	unitId: number;
	name: string;
	size: string;
	type: string;
	propertyId: number;
}

export const useEditUnit = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, UnitFormData>(async (variables) => {
		console.log('variables', variables);
		try {
			const response = await axios.post(ApiService.editUnit, variables, {
				withCredentials: true
			});
			await client.refetchQueries(ApiService.getPropertyById(variables.propertyId));

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not edit unit');
		}
	});
};
