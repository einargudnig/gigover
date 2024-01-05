import axios, { AxiosError } from 'axios';
import { ApiService } from '../../services/ApiService';
import { useMutation, useQueryClient } from 'react-query';
import { devError } from '../../utils/ConsoleUtils';
import { ErrorResponse } from '../../models/ErrorResponse';

export interface StakeHolderFormData {
	name: string;
	phoneNumber: string;
	email: string;
	role: string;
	unitId: number;
	propertyId: number;
	uId: string;
}

export const useAddStakeHolder = () => {
	const client = useQueryClient();

	return useMutation<AxiosError, ErrorResponse, StakeHolderFormData>(async (variables) => {
		try {
			const response = await axios.post(ApiService.addStakeholder, variables, {
				withCredentials: true
			});
			await client.refetchQueries(ApiService.getPropertyById(variables.propertyId));

			return response.data;
		} catch (e) {
			devError(e);
			throw new Error('Could not add unit');
		}
	});
};
