import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface PropertyFormData {
	propertyId: number;
	name: string;
	address: string;
	zipCode: string;
	city: string;
	country: string;
	size: string;
	type: string;
}

export const useEditProperty = () => {
	// const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, PropertyFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.editProperty, variables, {
				withCredentials: true
			});
			// await client.refetchQueries(ApiService.userProperties); -> Refetch Property by Id after editing it!

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add property');
		}
	});
};
