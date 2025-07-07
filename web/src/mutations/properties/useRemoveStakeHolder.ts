import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ApiService } from '../../services/ApiService';
import { devError } from '../../utils/ConsoleUtils';

export interface StakeHolderFormData {
	stakeHolderId: number;
	propertyId: number;
	unitId?: number;
	uId: string;
	role: string;
	name: string;
	phoneNumber: string;
	email: string;
}

export const useRemoveStakeHolder = () => {
	const client = useQueryClient();

	return useMutation<unknown, ErrorResponse, StakeHolderFormData>({
		mutationKey: [ApiService.removeStakeholder],
		mutationFn: async (variables) => {
			try {
				const response = await axios.post(ApiService.removeStakeholder, variables, {
					withCredentials: true
				});
				return response.data;
			} catch (e) {
				devError(e);
				throw e;
			}
		},
		onSuccess: async (_data, variables) => {
			await client.invalidateQueries({
				queryKey: [ApiService.getPropertyById(variables.propertyId)]
			});
		}
	});
};
