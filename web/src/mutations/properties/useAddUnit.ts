import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface UnitFormData {
	name: string;
	size: string;
	type: string;
	propertyId: number;
}

export const useAddUnit = () => {
	// const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, UnitFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addUnit, variables, {
				withCredentials: true
			});
			// await client.refetchQueries(ApiService.userProperties); -> Refetch Property by Id after editing it!

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add unit');
		}
	});
};
