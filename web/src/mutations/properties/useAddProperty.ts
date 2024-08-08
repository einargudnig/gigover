import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
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

	return useMutation<AxiosError, ErrorResponse, PropertyFormData>(async (variables) => {
		console.log('variables in useAddProperty custom hook', variables);
		try {
			const response = await axios.post(ApiService.addProperty, variables, {
				withCredentials: true
			});
			await client.refetchQueries(ApiService.getProperties);

			console.log('response in useAddProperty custom hook', response.data);

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add property');
		}
	});
};
