import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface StakeHolderFormData {
	name: string;
	phoneNumber: string;
	email: string;
	role: string;
	unitId?: number;
	propertyId: number;
	uId: string;
}

interface StakeHolderResponse {
	id: number;
}

export const useAddStakeHolder = () => {
	const client = useQueryClient();

	return useMutation<StakeHolderResponse, ErrorResponse, StakeHolderFormData>({
		mutationKey: [ApiService.addStakeholder],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.addStakeholder, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		},
		onSuccess: async (data, variables) => {
			await client.invalidateQueries({
				queryKey: [ApiService.getPropertyById(variables.propertyId)]
			});
		}
	});
};
